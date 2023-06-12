from fastapi import FastAPI
from vecs import create_client

from reworkd_platform.settings import settings


def init_supabase_vecs(app: FastAPI) -> None:  # pragma: no cover
    if url := settings.supabase_vecs_url:
        app.state.vecs = create_client(url)


def shutdown_supabase_vecs(app: FastAPI) -> None:  # pragma: no cover
    if vecs := app.state.vecs:
        vecs.disconnect()
