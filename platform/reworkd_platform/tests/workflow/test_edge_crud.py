import pytest
from pytest_mock import MockFixture

from reworkd_platform.db.crud.edge import EdgeCRUD
from reworkd_platform.schemas.workflow.base import EdgeUpsert


class TestEdgeCRUD:
    def test_add_edge_to_empty_map(self, mocker: MockFixture):
        edge_crud = EdgeCRUD(mocker.Mock())
        edge_upsert = EdgeUpsert(
            id=None, source="source", source_handle=None, target="target"
        )
        assert edge_crud.add_edge(edge_upsert)
        assert edge_crud.source_to_target_and_handle_map == {
            "source": {("target", None)}
        }

    def test_add_edge_to_non_empty_map(self, mocker: MockFixture):
        edge_crud = EdgeCRUD(mocker.Mock())
        edge_crud.source_to_target_and_handle_map = {"source": {("target1", None)}}

        edge_upsert = EdgeUpsert(
            id=None, source="source", source_handle=None, target="target2"
        )
        assert edge_crud.add_edge(edge_upsert)
        assert edge_crud.source_to_target_and_handle_map == {
            "source": {("target1", None), ("target2", None)}
        }

    @pytest.mark.asyncio
    async def test_delete_old_edges_not_present_in_edges_to_keep(self, mocker):
        edge_to_keep = EdgeUpsert(
            id="0", source="source", source_handle=None, target="target"
        )
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
        edge_crud.source_to_target_and_handle_map = {"source": {("target", None)}}

        edge_upsert = EdgeUpsert(
            id=None, source="source", source_handle=None, target="target"
        )
        assert not edge_crud.add_edge(edge_upsert)
        assert edge_crud.source_to_target_and_handle_map == {
            "source": {("target", None)}
        }
