import base64
import json
import os
import schedule
import time
from loguru import logger
from pydantic import BaseModel
from fastapi import APIRouter, Body, Depends
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
import google_auth_oauthlib.flow
from datetime import datetime, timedelta
import dateutil.parser as parser
from pytz import timezone

router = APIRouter()


class Message(BaseModel):
    message: dict


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
    topic = publisher.create_topic(request={"name": topic_path})
    print('Topic created: {}'.format(topic.name))

    # build the Gmail service
    service = build('gmail', 'v1', credentials=creds)

    # get the current date and time
    now = datetime.now(timezone('UTC'))
    now_str = now.strftime('%Y/%m/%d')

    # get the time two days ago
    past = now - timedelta(2)
    past_str = past.strftime('%Y/%m/%d')

    # get the email list within the past two days
    response = service.users().messages().list(userId='me', q=f'after:{past_str} before:{now_str}').execute()

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

                    # publish the message to pubsub
                    publisher.publish(topic_path, data=base64.b64encode(str(txt).encode('utf-8')))

            except Exception as error:
                print(f'An error occurred: {error}')

        print(f'Found {len(messages)} message(s).')
    else:
        print('No new messages.')


@router.post("/fetch_emails")
async def fetch_emails(
    request: Message = Body(...),
    # producer: WorkflowTaskProducer = Depends(WorkflowTaskProducer.inject),
    # crud: WorkflowCRUD = Depends(WorkflowCRUD.inject),
    # creds: OAuthCrud = Depends(OAuthCrud.inject),
) -> str:
    data = request.dict()
    

    email_data = base64.b64decode(data["message"]["data"])
    email_data = email_data.decode("utf-8")
    logger.info(email_data)

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
    return email_data

def auth_user():

# The client_secrets.json is the JSON file you download from the Credentials page in the Google Cloud Console
    flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
    'client_secrets.json',
    scopes=['https://www.googleapis.com/auth/gmail.modify'])

    flow.redirect_uri = 'http://localhost:3000'

    authorization_url, state = flow.authorization_url(access_type='offline',include_granted_scopes='true')

    print('Please go to this URL: {}'.format(authorization_url))

def watch_inbox():
    # Load credentials from the 'token.json' file
    creds = Credentials.from_authorized_user_file('token.json')

    # Build the Gmail service
    service = build('gmail', 'v1', credentials=creds)

    # Specify the user and the topic
    user_id = 'me'  # 'me' is a special value that indicates the authenticated user.
    topic_name = 'projects/myproject/topics/mytopic'  # Replace with your Project ID and Topic Name

    # Create the watch request
    request = {
        'labelIds': ['INBOX'],
        'topicName': topic_name
    }

    # Execute the watch request
    try:
        watch_response = service.users().watch(userId=user_id, body=request).execute()
        print('Successfully created watch with ID: {}'.format(watch_response['historyId']))
    except HttpError as error:
        print(f'An error occurred: {error}')


quickstart()

def job():
    # Load credentials from the 'token.json' file
    creds = Credentials.from_authorized_user_file('token.json')

    # Build the service
    service = build('gmail', 'v1', credentials=creds)

    # Create a request
    request = {
      'labelIds': ['INBOX'],
      'topicName': 'projects/reworkd-project/topics/MyTopic',
      'labelFilterBehavior': 'INCLUDE'
    }

    # Call the Gmail API
    response = service.users().watch(userId='me', body=request).execute()

    print(response)

# schedule.every(1).days.do(job)

# while True:
#     schedule.run_pending()
#     time.sleep(1)