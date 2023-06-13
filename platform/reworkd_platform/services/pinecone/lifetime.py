import pinecone

from reworkd_platform.settings import Settings


def init_pinecone(settings: Settings) -> None:
    if settings.pinecone_api_key and settings.pinecone_environment:
        pinecone.init(
            api_key=settings.pinecone_api_key,
            environment=settings.pinecone_environment,
        )
