import os.path
from typing import Any, Optional, Dict

from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

from reworkd_platform.schemas.workflow.base import Block, BlockIOBase
from reworkd_platform.services.sockets import websockets

SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"]


class GmailTriggerInput(BlockIOBase):
    message: str


class GmailTriggerOutput(BlockIOBase):
    message: str


class GmailTriggerBlock(Block):
    type = "GmailTrigger"
    description = "Manually trigger the workflow"
    image_url = ""
    input: GmailTriggerInput

    async def run(
        self,
        workflow_id: Any,
        credentials: Optional[Dict[str, str]] = None,
        **kwargs: Any,
    ) -> GmailTriggerOutput:
        credentials["gmail"] = "creds"  # TODO: add gmail oauth / unhardcode creds
        websockets.log(workflow_id, f"Email triggered workflow started")
        readEmails()
        return GmailTriggerOutput(**self.input.dict())


def readEmails():
    creds = None
    # The file token.json stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
    if os.path.exists("token.json"):
        creds = Credentials.from_authorized_user_file("token.json", SCOPES)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file("credentials.json", SCOPES)
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open("token.json", "w") as token:
            token.write(creds.to_json())

    try:
        # Call the Gmail API
        service = build("gmail", "v1", credentials=creds)
        results = service.users().labels().list(userId="me").execute()
        labels = results.get("labels", [])

        if not labels:
            print("No labels found.")
            return
        print("Labels:")
        for label in labels:
            print(label["name"])

    except HttpError as error:
        # TODO(developer) - Handle errors from gmail API.
        print(f"An error occurred: {error}")
