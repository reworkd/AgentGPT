from pytest_mock import MockFixture

from reworkd_platform.schemas.workflow.base import Block, Edge, Node
from reworkd_platform.services.worker.execution_engine import ExecutionEngine


def test_get_pruned_queue(mocker: MockFixture):
    mock_producer = mocker.MagicMock()
    mock_workflow = mocker.MagicMock()
    if_condition = mocker.MagicMock()
    if_condition.id = "node1"

    engine = ExecutionEngine(mock_producer, mock_workflow)

    node1 = Node(
        id="node1", ref="node1", pos_x=0, pos_y=0, block=mocker.MagicMock(spec=Block)
    )
    node2 = Node(
        id="node2", ref="node1", pos_x=0, pos_y=0, block=mocker.MagicMock(spec=Block)
    )
    mock_workflow.queue = [node2]

    edge2 = Edge(id="test", source="node1", target="node2", source_handle="true")
    mock_workflow.edges = [edge2]

    # Test pruning when branch is True
    pruned_queue = engine.get_pruned_queue(if_condition, True)
    assert len(pruned_queue) == 1
    assert pruned_queue[0].id == "node2"

    # Test pruning when branch is False
    pruned_queue = engine.get_pruned_queue(if_condition, False)
    assert len(pruned_queue) == 0
