from contextlib import closing
from typing import Dict, List

import boto3
from pydantic import BaseModel

REGION = "us-east-1"


class PresignedPost(BaseModel):
    url: str
    fields: Dict[str, str]


class SimpleStorageService:
    def upload_url(
        self,
        bucket_name: str,
        object_name: str,
    ) -> PresignedPost:
        with closing(boto3.client(service_name="s3")) as client:
            return PresignedPost(
                **client.generate_presigned_post(
                    Bucket=bucket_name,
                    Key=object_name,
                )
            )

    def list_files(self, bucket_name: str, prefix: str) -> List[str]:
        files: List[str] = []

        with closing(boto3.client(service_name="s3")) as client:
            response = client.list_objects_v2(Bucket=bucket_name, Prefix=prefix)
            if "Contents" in response:
                files = [item["Key"] for item in response["Contents"]]

        return files

    def download_file(
        self, bucket_name: str, object_name: str, local_filename: str
    ) -> None:
        with closing(boto3.client(service_name="s3")) as client:
            return client.download_file(bucket_name, object_name, local_filename)
