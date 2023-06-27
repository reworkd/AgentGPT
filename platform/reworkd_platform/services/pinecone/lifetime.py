import pinecone

from reworkd_platform.settings import settings


def init_pinecone() -> None:
    if settings.pinecone_api_key and settings.pinecone_environment:
        pinecone.init(
            api_key=settings.pinecone_api_key,
            environment=settings.pinecone_environment,
        )
