import os
import tempfile
from collections import defaultdict
from typing import Any, List, Dict, Union
from loguru import logger

import openai
import pinecone
from langchain.chains.question_answering import load_qa_chain
from langchain.document_loaders import PyPDFLoader
from langchain.embeddings import OpenAIEmbeddings
from langchain.embeddings.base import Embeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import Pinecone
from tabula.io import read_pdf

from reworkd_platform.schemas.agent import ModelSettings
from reworkd_platform.schemas.user import UserBase
from reworkd_platform.schemas.workflow.base import Block, BlockIOBase
from reworkd_platform.services.aws.s3 import SimpleStorageService
from reworkd_platform.settings import settings
from reworkd_platform.web.api.agent.model_factory import create_model


class SummaryAgentInput(BlockIOBase):
    company_context: str


class SummaryAgentOutput(SummaryAgentInput):
    result: str


class SummaryAgent(Block):
    type = "SummaryAgent"
    description = "Extract key details from text using OpenAI"
    input: SummaryAgentInput

    async def run(self, workflow_id: str, **kwargs: Any) -> BlockIOBase:
        with tempfile.TemporaryDirectory() as temp_dir:
            files = SimpleStorageService(
                bucket=settings.s3_bucket_name
            ).download_folder(
                prefix=f"{workflow_id}/",
                path=temp_dir,
            )

            docsearch = self.chunk_documents_to_pinecone(
                files=files,
                embeddings=(
                    OpenAIEmbeddings(
                        client=None,
                        # Meta private value but mypy will complain its missing
                        openai_api_key=settings.openai_api_key,
                    )
                ),
                path=temp_dir,
                workflow_id=workflow_id,
            )

            response = await self.execute_query_on_pinecone(
                company_context=self.input.company_context,
                docsearch=docsearch,
                workflow_id=workflow_id,
                path=temp_dir,
            )

        logger.info(f"SummaryAgent response: {response}")
        return SummaryAgentOutput(**self.input.dict(), result=response)

    def name_table(self, table: str) -> str:
        openai.api_key = settings.openai_api_key

        prompt = f"""
        Write a title for the table that is less than 9 words: {table}
        """

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=1,
            max_tokens=500,
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0,
        )

        response_message_content = response["choices"][0]["message"]["content"]

        return response_message_content

    def read_and_preprocess_tables(
        self, relevant_table_metadata: dict[str, list[int]]
    ) -> list[str]:
        processed = []
        parsed_dfs_from_file: Union[List[Any], Dict[str, Any]] = []

        for source in relevant_table_metadata.keys():
            page_numbers = relevant_table_metadata[source]
            filtered_page_numbers = list(filter(lambda x: x != 0, page_numbers))
            if len(filtered_page_numbers) > 1:
                filtered_page_numbers.sort()
                start_page = filtered_page_numbers[0]
                end_page = filtered_page_numbers[-1]
                parsed_dfs_from_file = read_pdf(
                    source, pages=f"{start_page}-{end_page}"
                )
                if isinstance(parsed_dfs_from_file, list):
                    for df in parsed_dfs_from_file:
                        if not df.empty:
                            df_name = self.name_table(str(df.iloc[:5]))
                            processed_df = "\n".join([df.to_csv(index=False)])
                            processed_df_with_title = "\n".join([df_name, processed_df])
                            processed.append(processed_df_with_title)
                elif isinstance(parsed_dfs_from_file, dict):
                    for key, df in parsed_dfs_from_file.items():
                        if not df.empty:
                            df_name = self.name_table(str(df.iloc[:5]))
                            processed_df = "\n".join([df.to_csv(index=False)])
                            processed_df_with_title = "\n".join([df_name, processed_df])
                            processed.append(processed_df_with_title)
                else:
                    # Handle unexpected case
                    raise ValueError("Unexpected type encountered.")

        return processed

    def chunk_documents_to_pinecone(
        self, files: list[str], embeddings: Embeddings, path: str, workflow_id: str
    ) -> Pinecone:
        index_name = "prod"
        index = pinecone.Index(index_name)
        index.delete(delete_all=True, namespace=workflow_id)
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=2000, chunk_overlap=0)

        texts = []
        for file in files:
            filepath = os.path.join(path, file)
            data = PyPDFLoader(filepath).load()
            pdf_data = data
            texts.extend(text_splitter.split_documents(pdf_data))

        docsearch = Pinecone.from_documents(
            [t for t in texts], embeddings, index_name=index_name, namespace=workflow_id
        )

        return docsearch

    async def execute_query_on_pinecone(
        self, company_context: str, docsearch: Pinecone, workflow_id: str, path: str
    ) -> str:
        similarity_prompt = f"""{company_context}. Include information relevant to the market, strategies, products, interesting quantitative metrics and trends that can inform decision-making. Gather info from different documents."""
        docs = docsearch.similarity_search(
            similarity_prompt, k=7, namespace=workflow_id
        )
        relevant_table_metadata: Dict[str, List[Any]] = defaultdict(list)
        for doc in docs:
            doc_source = doc.metadata["source"]
            page_number = int(doc.metadata["page"])
            if page_number not in relevant_table_metadata[doc_source]:
                relevant_table_metadata[doc_source].append(page_number)

        processed_tables = self.read_and_preprocess_tables(relevant_table_metadata)

        prompt = f"""Help extract information relevant to a company with the following details: {company_context} from the following documents. Start with the company background info. Then, include information relevant to the market, strategies, and products. Here are the documents: {docs}. After each point, reference the source you got the information from.

        Also list any interesting quantitative metrics or trends based on the following tables: {processed_tables}. Include which table you got information from.

        Cite sources for sentences using the page number from original source document. Do not list sources at the end of the writing.

        Example: "This is a cited sentence. (Source: Luxury Watch Market Size Report, Page 17).

        Format your response as slack markdown.
        """

        llm = create_model(
            ModelSettings(model="gpt-3.5-turbo-16k", max_tokens=2000),
            UserBase(id="", name=None, email="test@example.com"),
            streaming=False,
        )

        return await load_qa_chain(llm).arun(input_documents=docs, question=prompt)
