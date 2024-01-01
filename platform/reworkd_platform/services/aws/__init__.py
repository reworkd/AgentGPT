import boto3
from botocore.exceptions import ProfileNotFound

try:
    boto3.setup_default_session(profile_name="dev")
except ProfileNotFound:
    pass
