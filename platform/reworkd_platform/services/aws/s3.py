import io
import os
from typing import Dict, List, Optional

from aiohttp import ClientError
from boto3 import client as boto3_client
from loguru import logger
from pydantic import BaseModel

REGION = "us-east-1"


# noinspection SpellCheckingInspection
class PresignedPost(BaseModel):
    url: str
    fields: Dict[str, str]


class SimpleStorageService:
    # TODO: would be great if with could make this async

    def __init__(self, bucket: Optional[str]) -> None:
        if not bucket:
            raise ValueError("Bucket name must be provided")

        self._client = boto3_client("s3", region_name=REGION)
        self._bucket = bucket

    def create_presigned_upload_url(
        self,
        object_name: str,
    ) -> PresignedPost:
        return PresignedPost(
            **self._client.generate_presigned_post(
                Bucket=self._bucket,
                Key=object_name,
            )
        )

    def create_presigned_download_url(self, object_name: str) -> str:
        return self._client.generate_presigned_url(
            "get_object",
            Params={"Bucket": self._bucket, "Key": object_name},
        )

    def upload_to_bucket(
        self,
        object_name: str,
        file: io.BytesIO,
    ) -> None:
        try:
            self._client.put_object(
                Bucket=self._bucket, Key=object_name, Body=file.getvalue()
            )
        except ClientError as e:
            logger.error(e)
            raise e

    def download_file(self, object_name: str, local_filename: str) -> None:
        self._client.download_file(
            Bucket=self._bucket, Key=object_name, Filename=local_filename
        )

    def list_keys(self, prefix: str) -> List[str]:
        files = self._client.list_objects_v2(Bucket=self._bucket, Prefix=prefix)
        if "Contents" not in files:
            return []

        return [file["Key"] for file in files["Contents"]]

    def download_folder(self, prefix: str, path: str) -> List[str]:
        local_files = []
        for key in self.list_keys(prefix):
            local_filename = os.path.join(path, key.split("/")[-1])
            self.download_file(key, local_filename)
            local_files.append(local_filename)

        return local_files

    def delete_folder(self, prefix: str) -> None:
        keys = self.list_keys(prefix)
        self._client.delete_objects(
            Bucket=self._bucket,
            Delete={"Objects": [{"Key": key} for key in keys]},
        )
