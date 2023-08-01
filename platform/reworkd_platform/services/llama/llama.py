from llama_index import download_loader

import os
from typing import Dict, List
import re

from pydantic import BaseModel
from llama_index.readers.schema.base import Document

REGION = "us-east-1"


class LlamaLoader:
    def __init__(self) -> None:
        self.document_pool: list[Document] = []

    def load_google_sheets(
        self,
        spreadsheet_ids: List[str],
    ) -> List[Document]:
        GoogleSheetsReader = download_loader("GoogleSheetsReader")
        loader = GoogleSheetsReader()
        loaded_documents = loader.load_data(spreadsheet_ids)
        self.document_pool.extend(loaded_documents)
        return loaded_documents


import google.auth
from google.auth.transport.requests import Request
from googleapiclient.discovery import build


class GoogleSheetsReader:
    def __init__(self, creds_path):
        self.creds_path = creds_path
        # self.credentials, self.project = google.auth.load_credentials_from_file(
        #     self.creds_path
        # )
        # self.service = build("sheets", "v4", credentials=self.credentials)

    def get_spreadsheet_id_from_link(self, link):
        pattern = r"/spreadsheets/d/([a-zA-Z0-9-_]+)"
        match = re.search(pattern, link)
        if match:
            spreadsheet_id = match.group(1)
            return spreadsheet_id
        else:
            return None

    def get_spreadsheet(self, spreadsheet_id):
        try:
            spreadsheet = (
                self.service.spreadsheets().get(spreadsheetId=spreadsheet_id).execute()
            )
            return spreadsheet
        except Exception as e:
            print(f"Error while fetching spreadsheet data: {e}")
            raise

    def flatten_spreadsheet_data(self, spreadsheet_data):
        flattened_string = ""

        for sheet in spreadsheet_data["sheets"]:
            sheet_title = sheet["properties"]["title"]
            sheet_data = sheet["data"][0]["rowData"]

            if not sheet_data:
                continue

            for row in sheet_data:
                if "values" not in row:
                    continue

                for cell in row["values"]:
                    if "formattedValue" in cell:
                        flattened_string += cell["formattedValue"] + " "
                flattened_string += "\n"

        return flattened_string


def test_sheets_reader():
    # Replace 'YOUR_CREDENTIALS_PATH' with the path to your Google API credentials JSON file
    creds_path = "YOUR_CREDENTIALS_PATH"
    spreadsheet_id = "YOUR_SPREADSHEET_ID"

    reader = GoogleSheetsReader(creds_path)

    try:
        spreadsheet_data = reader.get_spreadsheet(spreadsheet_id)
        flattened_string = reader.flatten_spreadsheet_data(spreadsheet_data)
        print(flattened_string)
    except Exception as e:
        print(f"Error: {e}")


# test_sheets_reader()