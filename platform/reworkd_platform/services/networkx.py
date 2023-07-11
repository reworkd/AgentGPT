from typing import Union

from networkx import Graph, DiGraph
from networkx.algorithms.components import is_connected
from networkx.algorithms.cycles import find_cycle
from networkx.exception import NetworkXNoCycle


def validate_connected_and_acyclic(graph: Union[Graph, DiGraph]) -> bool:
    if not is_connected(graph.to_undirected()):
        raise ValueError("The workflow must be connected.")

    try:
        find_cycle(graph)
    except NetworkXNoCycle:
        return True

    raise ValueError("The workflow must not contain a cycle.")
