import pytest
from pytest_mock import MockFixture

from reworkd_platform.db.crud.edge import EdgeCRUD
from reworkd_platform.schemas.workflow import EdgeUpsert


class TestEdgeCRUD:
    def test_add_edge_to_empty_map(self, mocker: MockFixture):
        edge_crud = EdgeCRUD(mocker.Mock())
        assert edge_crud.add_edge("source", "target")
        assert edge_crud.source_target_map == {"source": {"target"}}

    def test_add_edge_to_non_empty_map(self, mocker: MockFixture):
        edge_crud = EdgeCRUD(mocker.Mock())
        edge_crud.source_target_map = {"source": {"target1"}}

        assert edge_crud.add_edge("source", "target2")
        assert edge_crud.source_target_map == {"source": {"target1", "target2"}}

    @pytest.mark.asyncio
    async def test_delete_old_edges_not_present_in_edges_to_keep(self, mocker):
        edge_to_keep = EdgeUpsert(id="0", source="source", target="target")
        mock_session = mocker.Mock()
        mock_edge = mocker.Mock(id="1")
        mock_all_edges = {"1": mock_edge, "0": edge_to_keep}
        mocker.patch.object(mock_edge, "delete", mocker.AsyncMock())

        mock_edges_to_keep = [edge_to_keep]
        await EdgeCRUD(mock_session).delete_old_edges(
            mock_edges_to_keep, mock_all_edges
        )

        mock_edge.delete.assert_called_once_with(mock_session)

    def test_add_edge_with_existing_source_and_target(self, mocker: MockFixture):
        edge_crud = EdgeCRUD(mocker.Mock())
        edge_crud.source_target_map = {"source": {"target"}}
        assert not edge_crud.add_edge("source", "target")
        assert edge_crud.source_target_map == {"source": {"target"}}
