from typing import Union

from networkx import Graph, DiGraph
from networkx.algorithms.components import is_connected
from networkx.algorithms.cycles import find_cycle
from networkx.exception import NetworkXNoCycle, NetworkXPointlessConcept


def validate_connected_and_acyclic(graph: Union[Graph, DiGraph]) -> bool:
    try:
        if not is_connected(graph.to_undirected()):
            raise ValueError("The workflow must be connected.")
    except NetworkXPointlessConcept:
        return True

    try:
        find_cycle(graph)
    except NetworkXNoCycle:
        return True

    raise ValueError("The workflow must not contain a cycle.")
