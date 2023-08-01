import tempfile
from typing import Literal
from loguru import logger
from fastapi import APIRouter
from fastapi.responses import StreamingResponse as FastAPIStreamingResponse
from reworkd_platform.services.aws.s3 import SimpleStorageService
from pydantic import BaseModel, Field
from fastapi import Depends
from langchain import OpenAI, LLMChain, PromptTemplate
import openai
from reworkd_platform.settings import settings

from reworkd_platform.schemas import (
    ModelSettings,
    UserBase,
)
from reworkd_platform.web.api.agent.model_factory import create_model
from reworkd_platform.web.api.agent.tools.image import Image
from reworkd_platform.web.api.dependencies import get_current_user
from reworkd_platform.services.pinecone.pinecone import PineconeMemory

router = APIRouter()

MODALITY = Literal["text", "image"]


class ChatModelSettings(ModelSettings):
    modality: MODALITY = Field(default="text")


class ChatBodyV1(BaseModel):
    model_settings: ChatModelSettings = Field(default=ChatModelSettings())
    prompt: str


class Input(BaseModel):
    human_input: str


@router.post("/v1/chatwithin")
async def chatwithin3(
    body: ChatBodyV1, user: UserBase = Depends(get_current_user)
) -> str:
    docsearch = get_similar_docs(body.prompt)

    logger.info(f"Similar docs: {docsearch}")

    template = """PDFAssistant is a language model designed to help you chat with your PDFs.

        Provided documents: {similar_docs}
        PDFAssistant can take your PDF and answer questions, fetch relevant information, and even pull relevant statistics from tables and figures.
        PDFAssistant will cite all its sources, referencing the page number it got certain information from. If it can't find the information in the provided docs above, it will state that no information was found in the provided documents.

        {history}
        Human: {prompt}
        PDFAssistant:"""

    prompt = PromptTemplate(
        input_variables=["history", "prompt", "similar_docs"], template=template
    )

    llm = create_model(body.model_settings, user=user, streaming=True)

    chain = LLMChain(
        llm=llm,
        prompt=prompt,
        verbose=True,
    )

    output = chain.predict(prompt=body.prompt, history="", similar_docs=docsearch)
    return output


def get_similar_docs(query: str) -> str:
    with PineconeMemory(
        index_name="prod", namespace="571b703d-b349-4a5e-82cb-3c9131fd19d0"
    ) as pinecone:
        logger.info(pinecone.index.describe_index_stats())
        results = pinecone.get_similar_tasks(query, 0.75)
        return results
