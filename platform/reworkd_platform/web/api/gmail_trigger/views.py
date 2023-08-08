import base64
import os
from loguru import logger
from pydantic import BaseModel
import json
import ast
from fastapi import APIRouter, Body, Depends
from fastapi import Request as req
from reworkd_platform.db.crud.oauth import OAuthCrud
from reworkd_platform.services.kafka.producers.task_producer import WorkflowTaskProducer
from reworkd_platform.services.worker.execution_engine import ExecutionEngine
from reworkd_platform.db.crud.workflow import WorkflowCRUD
from reworkd_platform.web.api.http_responses import forbidden
from reworkd_platform.schemas.workflow.base import (BlockIOBase)
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google.cloud import pubsub_v1
from datetime import datetime, timedelta
import dateutil.parser as parser

router = APIRouter()



SCOPES = ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/pubsub']

def quickstart():
    creds = None
    # The file token.json stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        CURR_DIR = os.path.dirname(os.path.realpath(__file__))
        credential_file=str(CURR_DIR)+'/credentials.json'
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
            print('refreshed')
            print(creds)
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                credential_file, SCOPES)
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open('token.json', 'w') as token:
            token.write(creds.to_json())

    publisher = pubsub_v1.PublisherClient(credentials=creds)
    topic_path = publisher.topic_path('reworkd-emails','email-trigger-pool')

    service = build('gmail', 'v1', credentials=creds)

    now = datetime.now()
    now_str = now.strftime('%Y/%m/%d')
    past = now - timedelta(2)
    past_str = past.strftime('%Y/%m/%d')

    response = service.users().messages().list(userId='me', q=f'after:{past_str}').execute()
    logger.info(f"number of messages from last two days: {len(response['messages'])}")

    if 'messages' in response:
        messages = []
        for msg in response['messages']:
            txt = service.users().messages().get(userId='me', id=msg['id']).execute()

            try:
                payload = txt['payload']
                headers = payload['headers']

                for d in headers:
                    if d['name'] == 'Date':
                        msg_date = parser.parse(d['value'])
                        msg_date = msg_date.strftime('%Y/%m/%d')

                if past_str <= msg_date <= now_str:
                    messages.append(txt)
                    publisher.publish(topic_path, data=base64.b64encode(str(txt).encode('utf-8')))

            except Exception as error:
                print(f'An error occurred: {error}')

        print(f'Found {len(messages)} message(s).')
    else:
        print('No new messages.')


@router.post("/fetch_emails")
async def fetch_emails(
    request: req,
) -> str:
    raw_data = await request.body()
    decoded_bytes = base64.b64decode(raw_data)
    decoded_data = decoded_bytes.decode("utf-8")
    dict_repr = ast.literal_eval(decoded_data)
    snippet_value = dict_repr.get("snippet", "Snippet key not found!")
    logger.info(snippet_value)


    return snippet_value

quickstart()


    # url = "http://localhost:8000/{workflow_id}/email"
    # url = url.format(workflow_id="245dce41-937b-43d7-96ba-c937ae9d9a90")
    # headers = {
    #     "Content-Type": "application/json",
    # }
    # response = requests.post(url, headers=headers, data=json.dumps(data))
    # if response.status_code == 200:
    #     print("Workflow execution was successful")
    # else:
    #     print("Workflow execution failed")

    # workflow = await crud.get("245dce41-937b-43d7-96ba-c937ae9d9a90")
    # plan = ExecutionEngine.create_execution_plan(
    #     producer=producer,
    #     workflow=workflow,
    #     credentials=await creds.get_all(crud.user),
    # )

    # if plan.workflow.queue[0].block.type != "GmailTriggerBlock":
    #     forbidden("Gmail trigger not defined for this workflow")

    # # Place input from API call into trigger input
    # plan.workflow.queue[0].block.input = BlockIOBase(**request.dict())

    # await plan.start()