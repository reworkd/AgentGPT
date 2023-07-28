from reworkd_platform.services.aws.s3 import SimpleStorageService


def test_create_signed_post(mocker):
    post_url = {
        "url": "https://my_bucket.s3.amazonaws.com/my_object",
        "fields": {"key": "value"},
    }

    boto3_mock = mocker.Mock()
    boto3_mock.generate_presigned_post.return_value = post_url
    mocker.patch(
        "reworkd_platform.services.aws.s3.boto3_client", return_value=boto3_mock
    )

    assert (
        SimpleStorageService(bucket="my_bucket").create_presigned_upload_url(
            object_name="json"
        )
        == post_url
    )
