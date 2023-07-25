from typing import Dict, List

from boto3 import client as boto3_client, resource as boto3_resource
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

    @staticmethod
    def list_files(bucket_name: str, prefix: str) -> List[str]:
        bucket = boto3_resource("s3", region_name=REGION).Bucket(bucket_name)
        return [obj.key for obj in bucket.objects.filter(Prefix=prefix)]

    def download_file(
        self, bucket_name: str, object_name: str, local_filename: str
    ) -> None:
        return self._client.download_file(bucket_name, object_name, local_filename)
