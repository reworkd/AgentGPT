from reworkd_platform.services.aws.s3 import SimpleStorageService


def test_put_metric_data():
    service = SimpleStorageService()

    x = service.upload_url(
        bucket_name="test-pdf-123",
        object_name="test",
    )
