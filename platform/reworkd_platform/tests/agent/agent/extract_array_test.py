from typing import List

import pytest

from reworkd_platform.web.api.agent.helpers import extract_array


@pytest.mark.parametrize(
    "model_result, expected_length, expected_output",
    [
        (
            """
              ```json
            [
              "Research and implement natural language processing techniques to improve task creation accuracy.",
              "Develop a machine learning model to predict the most relevant tasks for users based on their past activity.",
              "Integrate with external tools and services to provide users with additional features such as task prioritization and scheduling."
            ]
              ```
            """,
            3,
            [
                "Research and implement natural language processing techniques to improve task creation accuracy.",
                "Develop a machine learning model to predict the most relevant tasks for users based on their past activity.",
                "Integrate with external tools and services to provide users with additional features such as task prioritization and scheduling.",
            ],
        ),
        (
            "['Search Reddit for current trending topics related to cats', 'Identify the most upvoted posts about cats on Reddit']",
            0,
            [],
        ),
        ('["Item 1","Item 2","Item 3"]', 3, ["Item 1", "Item 2", "Item 3"]),
        ("This is not an array", 0, []),
        ("[]", 0, []),
        (
            """
            [
              "Only one element"
            ]
            """,
            1,
            ["Only one element"],
        ),
    ],
)
def test_extract_array(
    model_result: str, expected_length: int, expected_output: List[str]
) -> None:
    result = extract_array(model_result)
    assert len(result) == expected_length
    assert result == expected_output
