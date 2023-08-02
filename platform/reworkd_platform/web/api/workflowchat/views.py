import tempfile
from typing import Literal
from loguru import logger
from fastapi import APIRouter
from fastapi.responses import StreamingResponse as FastAPIStreamingResponse
from reworkd_platform.services.aws.s3 import SimpleStorageService
from pydantic import BaseModel, Field
from fastapi import Depends
from langchain import LLMChain, PromptTemplate
from reworkd_platform.settings import settings
from reworkd_platform.web.api.dependencies import get_organization_user

from reworkd_platform.schemas import (
    ModelSettings,
    UserBase,
)
from reworkd_platform.web.api.agent.model_factory import create_model
from reworkd_platform.web.api.agent.tools.image import Image
from reworkd_platform.web.api.dependencies import get_current_user
from reworkd_platform.services.pinecone.pinecone import PineconeMemory
from lanarky.responses import StreamingResponse

router = APIRouter()


class ChatBody(BaseModel):
    message: str
    model_settings: ModelSettings
    workflow_id: str


class Input(BaseModel):
    human_input: str


@router.post("/workflow_chat")
async def workflow_chat(
    body: ChatBody, user: UserBase = Depends(get_organization_user)
) -> FastAPIStreamingResponse:
    docsearch = get_similar_docs(body.message, body.workflow_id)

    logger.info(f"Similar docs: {docsearch}")

    template = """PDFAssistant is a language model designed to help you chat with your PDFs.

        Provided documents: {similar_docs}
        PDFAssistant can take your PDF and answer questions, fetch relevant information, and even pull relevant statistics from tables and figures.
        PDFAssistant will cite all its sources, referencing the page number it got certain information from. Do not use Document ID's, but names of documents that humans would understand. If it can't find the information in the provided docs above, it will state that no information was found in the provided documents.

        {history}
        Human: {message}
        PDFAssistant:"""

    prompt = PromptTemplate(
        input_variables=["history", "message", "similar_docs"], template=template
    )

    llm = create_model(body.model_settings, user=user, streaming=True)

    chain = LLMChain(
        llm=llm,
        prompt=prompt,
        verbose=True,
    )

    return StreamingResponse.from_chain(
        chain,
        {
            "message": body.message,
            "history": "",
            "similar_docs": docsearch,
        },
        media_type="text/event-stream",
    )


def get_similar_docs(query: str, workflow_id: str) -> str:
    with PineconeMemory(index_name="prod", namespace=workflow_id) as pinecone:
        logger.info(pinecone.index.describe_index_stats())
        results = pinecone.get_similar_tasks(query, 0.75)
        return results
