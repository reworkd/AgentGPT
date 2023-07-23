from typing import List
from unittest.mock import MagicMock

import pytest
from pytest_mock import MockFixture

from reworkd_platform.schemas.workflow.base import Block, Edge, Node
from reworkd_platform.services.worker.execution_engine import ExecutionEngine

test_cases = [
    # Test case when there are no edges
    (
        [Node(id="node1", ref="node1", pos_x=0, pos_y=0, block=MagicMock(spec=Block))],
        [],
        0,
        0,
    ),
    # Test case when there is only one edge and one child node on the true side
    (
        [
            Node(
                id="node1", ref="node1", pos_x=0, pos_y=0, block=MagicMock(spec=Block)
            ),
            Node(
                id="node2", ref="node2", pos_x=0, pos_y=0, block=MagicMock(spec=Block)
            ),
        ],
        [
            Edge(id="test1", source="node1", target="node2", source_handle="true"),
        ],
        1,
        0,
    ),
    # Test case when there is only one edge and one child node on the false side
    (
        [
            Node(
                id="node1", ref="node1", pos_x=0, pos_y=0, block=MagicMock(spec=Block)
            ),
            Node(
                id="node2", ref="node2", pos_x=0, pos_y=0, block=MagicMock(spec=Block)
            ),
        ],
        [
            Edge(id="test2", source="node1", target="node2", source_handle="false"),
        ],
        0,
        1,
    ),
    # Test case when there are two child nodes on one side
    (
        [
            Node(
                id="node1", ref="node1", pos_x=0, pos_y=0, block=MagicMock(spec=Block)
            ),
            Node(
                id="node2", ref="node2", pos_x=0, pos_y=0, block=MagicMock(spec=Block)
            ),
            Node(
                id="node3", ref="node3", pos_x=0, pos_y=0, block=MagicMock(spec=Block)
            ),
            Node(
                id="node4", ref="node4", pos_x=0, pos_y=0, block=MagicMock(spec=Block)
            ),
        ],
        [
            Edge(id="test2", source="node1", target="node2", source_handle="true"),
            Edge(id="test3", source="node1", target="node3", source_handle="true"),
            Edge(id="test4", source="node1", target="node4", source_handle="false"),
        ],
        2,
        1,
    ),
    # Test case when there is a child node with a child node on one side
    (
        [
            Node(
                id="node1", ref="node1", pos_x=0, pos_y=0, block=MagicMock(spec=Block)
            ),
            Node(
                id="node2", ref="node2", pos_x=0, pos_y=0, block=MagicMock(spec=Block)
            ),
            Node(
                id="node3", ref="node3", pos_x=0, pos_y=0, block=MagicMock(spec=Block)
            ),
            Node(
                id="node4", ref="node4", pos_x=0, pos_y=0, block=MagicMock(spec=Block)
            ),
        ],
        [
            Edge(id="test2", source="node1", target="node2", source_handle="true"),
            Edge(id="test3", source="node2", target="node3", source_handle="true"),
            Edge(id="test4", source="node1", target="node4", source_handle="false"),
        ],
        2,
        1,
    ),
]


@pytest.mark.parametrize(
    "nodes,edges,expected_size_true,expected_size_false", test_cases
)
def test_get_pruned_queue(
    nodes: List[Node],
    edges: List[Edge],
    expected_size_true: int,
    expected_size_false: int,
    mocker: MockFixture,
):
    mock_producer = mocker.MagicMock()
    mock_workflow = mocker.MagicMock()
    if_condition = mocker.MagicMock()
    if_condition.id = nodes[0].id

    engine = ExecutionEngine(mock_producer, mock_workflow)
    mock_workflow.queue = nodes
    mock_workflow.edges = edges

    pruned_queue_true = engine.get_pruned_queue(if_condition, True)
    pruned_queue_false = engine.get_pruned_queue(if_condition, False)

    assert len(pruned_queue_true) == expected_size_true
    assert len(pruned_queue_false) == expected_size_false
