from fastapi import FastAPI
from vecs import Client

from reworkd_platform.settings import settings


def init_supabase_vecs(app: FastAPI) -> None:
    if url := settings.supabase_vecs_url:
        app.state.vecs = Client(connection_string=url)


def shutdown_supabase_vecs(app: FastAPI) -> None:
    if vecs := getattr(app.state, "vecs", None):
        vecs.disconnect()
