import base64
import json
import os.path
import time
from typing import Any, Optional, Dict
from fastapi import APIRouter
from loguru import logger
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from requests import request

from reworkd_platform.schemas.workflow.base import Block, BlockIOBase
from reworkd_platform.services.sockets import websockets

router = APIRouter()

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
        **kwargs: Any,
    ) -> GmailTriggerOutput:
        def log(msg: Any) -> None:
            websockets.log(workflow_id, msg)
            
        log(f"Manual workflow started")
        return GmailTriggerOutput(**self.input.dict())