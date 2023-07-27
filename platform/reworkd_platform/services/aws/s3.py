import io
import os
from typing import Dict, List

import aiohttp
from boto3 import client as boto3_client
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
        pre_signed_post = self.upload_url(bucket_name, object_name)

        # Prepare the data for aiohttp format
        data = aiohttp.FormData()
        for key, value in pre_signed_post.fields.items():
            data.add_field(key, value)
        data.add_field("file", file, filename=object_name)

        async with aiohttp.ClientSession() as session:
            response = await session.post(pre_signed_post.url, data=data)

        # Raise an exception if the upload failed
        if response.status != 204:
            raise Exception(f"S3 upload failed: {await response.text()}")

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
