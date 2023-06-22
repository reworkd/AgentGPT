from fastapi import Request
from vecs import Client


def get_supabase_vecs(request: Request) -> Client:
    return request.app.state.vecs
