from fastapi import Request
from vecs import Client


def get_supabase_vecs(request: Request) -> Client:  # pragma: no cover
    """
    Returns kafka producer.

    :param request: current request.
    :return: kafka producer from the state.
    """
    return request.app.state.vecs
