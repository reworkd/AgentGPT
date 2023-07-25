from typing import Dict, List

from boto3.session import Session
from pydantic import BaseModel

REGION = "us-east-1"


class PresignedPost(BaseModel):
    url: str
    fields: Dict[str, str]


class SimpleStorageService:
    def __init__(self, region: str = REGION) -> None:
        pass

    def upload_url(
        self,
        bucket_name: str,
        object_name: str,
    ) -> PresignedPost:
        return PresignedPost(
            **Session(profile_name="dev", region_name=REGION)
            .client(service_name="s3")
            .generate_presigned_post(
                Bucket=bucket_name,
                Key=object_name,
            )
        )

    def list_files(self, bucket_name: str, prefix: str) -> List[str]:
        return [
            object_summary.key
            for object_summary in Session(profile_name="dev", region_name=REGION)
            .resource("s3")
            .Bucket(bucket_name)
            .objects.filter(Prefix=prefix)
        ]

    def download_file(
        self, bucket_name: str, object_name: str, local_filename: str
    ) -> None:
        Session(profile_name="dev", region_name=REGION).resource("s3").Bucket(
            bucket_name
        ).download_file(object_name, local_filename)
