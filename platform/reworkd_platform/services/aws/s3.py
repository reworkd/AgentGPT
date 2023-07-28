import io
import os
from typing import Dict, List

from aiohttp import ClientError
from boto3 import client as boto3_client
from loguru import logger
from pydantic import BaseModel

REGION = "us-east-1"


class PresignedPost(BaseModel):
    url: str
    fields: Dict[str, str]


class SimpleStorageService:
    def __init__(
        self,
    ) -> None:
        self._client = boto3_client("s3", region_name=REGION)

    def upload_url(
        self,
        bucket_name: str,
        object_name: str,
    ) -> PresignedPost:
        return PresignedPost(
            **self._client.generate_presigned_post(
                Bucket=bucket_name,
                Key=object_name,
            )
        )

    def download_url(self, bucket_name: str, object_name: str) -> str:
        return self._client.generate_presigned_url(
            "get_object",
            Params={"Bucket": bucket_name, "Key": object_name},
        )

    async def upload_to_bucket(
        self,
        bucket_name: str,
        object_name: str,
        file: io.BytesIO,
    ) -> None:
        try:
            self._client.put_object(
                Bucket=bucket_name, Key=object_name, Body=file.getvalue()
            )
        except ClientError as e:
            logger.error(e)
            raise e

    def download_file(
        self, bucket_name: str, object_name: str, local_filename: str
    ) -> None:
        self._client.download_file(
            Bucket=bucket_name, Key=object_name, Filename=local_filename
        )

    def download_folder(self, bucket_name: str, prefix: str, path: str) -> List[str]:
        files = self._client.list_objects_v2(Bucket=bucket_name, Prefix=prefix)
        local_files: List[str] = []

        if "Contents" not in files:
            return local_files

        for file in files["Contents"]:
            object_name = file["Key"]
            local_filename = os.path.join(path, object_name.split("/")[-1])
            self.download_file(bucket_name, object_name, local_filename)
            local_files.append(local_filename)

        return local_files
