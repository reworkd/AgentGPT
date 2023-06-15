import pytest

from reworkd_platform.services.vecs.vecs import VecsMemory


@pytest.mark.parametrize(
    "query_result, expected",
    [
        (
            [
                (0, 0.78, {"text": "metadata1"}),
                (1, 0.99, {"text": "metadata1"}),
                (2, 0.25, {"text": "metadata2"}),
            ],
            0,
        ),
        (
            [
                (1, 0.01, {"text": "metadata1"}),
                (2, 0.02, {"text": "metadata1"}),
                (3, 0.1, {"text": "metadata1"}),
                (4, 0.90, {"text": "metadata2"}),
                (5, 0.97, {"text": "metadata2"}),
                (6, 0.06, {"text": "metadata1"}),
            ],
            2,
        ),
    ],
)
def test_get_similar_tasks(mocker, query_result, expected):
    collection_mock = mocker.Mock()
    collection_mock.query.return_value = query_result
    client_mock = mocker.Mock()
    client_mock.get_collection.return_value = collection_mock

    # Create an instance of your class
    service = VecsMemory(client_mock, "index_name")

    # Create a mock for the `embeddings` object
    embeddings_mock = mocker.Mock()
    embeddings_mock.embed_query.return_value = [
        1,
        2,
        3,
    ]

    service.embeddings = embeddings_mock

    # Call the method you want to test
    result = service.get_similar_tasks("test")
    assert len(result) == expected
