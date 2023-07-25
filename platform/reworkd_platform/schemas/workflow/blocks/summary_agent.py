import os
import tempfile

import pinecone
from langchain.chains.question_answering import load_qa_chain
from langchain.document_loaders import PyPDFLoader
from langchain.embeddings import OpenAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import Pinecone

from reworkd_platform.schemas.agent import ModelSettings
from reworkd_platform.schemas.user import UserBase
from reworkd_platform.schemas.workflow.base import Block, BlockIOBase
from reworkd_platform.services.aws.s3 import SimpleStorageService
from reworkd_platform.settings import settings
from reworkd_platform.web.api.agent.model_settings import create_model

INDEX_NAME = "prod"


class SummaryAgentInput(BlockIOBase):
    company_context: str


class SummaryAgentOutput(SummaryAgentInput):
    result: str


class SummaryAgent(Block):
    type = "SummaryAgent"
    description = "Extract key details from text using OpenAI"
    input: SummaryAgentInput

    async def run(self, workflow_id: str) -> BlockIOBase:
        with tempfile.TemporaryDirectory() as temp_dir:
            files = SimpleStorageService().download_folder(
                bucket_name="test-pdf-123", prefix=f"{workflow_id}/", path=temp_dir
            )

            docsearch = self.chunk_documents_to_pinecone(
                files=files,
                path=temp_dir,
            )

        response = await self.execute_query_on_pinecone(
            context=self.input.company_context, docsearch=docsearch
        )

        return SummaryAgentOutput(**self.input.dict(), result=response)

    def chunk_documents_to_pinecone(self, files: list[str], path: str) -> Pinecone:
        index = pinecone.Index(INDEX_NAME)
        index.delete(delete_all=True)  # TODO put this in a namespace
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=2000, chunk_overlap=0)
        embedding = OpenAIEmbeddings(
            client=None,
            openai_api_key=settings.openai_api_key,
        )

        # TODO do this async in parallel
        texts = []
        for file in files:
            filepath = os.path.join(path, file)
            pdf_data = PyPDFLoader(filepath).load()
            texts.extend(text_splitter.split_documents(pdf_data))

        return Pinecone.from_texts(
            [t.page_content for t in texts],
            embedding,
            index_name=INDEX_NAME,
        )

    async def execute_query_on_pinecone(self, context: str, docsearch: Pinecone) -> str:
        docs = docsearch.similarity_search(context, k=7)

        prompt = f"""
        Help extract information relevant to a company with the following details: {context} from the following documents. Include information relevant to the market, strategies, and products. Here are the documents: {docs}. After each point, reference the source you got each piece of information from (cite the source). If there's multiple sources, include information from all sources.
        """

        llm = create_model(
            ModelSettings(model="gpt-3.5-turbo-16k", max_tokens=2000),
            UserBase(id="", name=None, email="test@example.com"),
            streaming=False,
        )

        return await load_qa_chain(llm).arun(input_documents=docs, question=prompt)
