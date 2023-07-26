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

<<<<<<< HEAD
        response_message_content = response["choices"][0]["message"]["content"]

        return response_message_content

    def read_and_preprocess_tables(self, relevant_table_metadata: defaultdict(list)) -> list[str]:
        processed = []
        parsed_dfs_from_file = []
        for source in relevant_table_metadata.keys():
            page_numbers = relevant_table_metadata[source]
            filtered_page_numbers = list(filter(lambda x: x != 0, page_numbers))
            if len(filtered_page_numbers) > 1:
                filtered_page_numbers.sort()
                start_page = filtered_page_numbers[0]
                end_page = filtered_page_numbers[-1]
            
                pages_to_read = ','.join(str(page) for page in filtered_page_numbers)
                parsed_dfs_from_file = tabula.read_pdf(source, pages=f"{start_page}-{end_page}")
                for df in parsed_dfs_from_file:
                    if not df.empty:
                        df_name = self.name_table(str(df.iloc[:5]))
                        processed_df = "\n".join([df.to_csv(index=False)])
                        processed_df_with_title = "\n".join([df_name, processed_df])
                        processed.append(processed_df_with_title)

        return processed

    def chunk_documents_to_pinecone(
        self, files: list[str], embeddings: Embeddings, path: str
    ) -> Pinecone:
        index_name = "prod"
        index = pinecone.Index(index_name)
        index.delete(delete_all=True)
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=2000, chunk_overlap=0)
=======
        # TODO do this async in parallel
>>>>>>> parent of 0fea00c (read and extract info from pdf tables)
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

<<<<<<< HEAD
        return docsearch

    async def execute_query_on_pinecone(
        self, company_context: str, docsearch: Pinecone
    ) -> str:
        docs = docsearch.similarity_search(company_context, k=7)
        relevant_table_metadata = defaultdict(list)
        for doc in docs:
            doc_source = doc.metadata['source']
            page_number = int(doc.metadata['page'])
            relevant_table_metadata[doc_source].append(page_number)

        processed_tables = self.read_and_preprocess_tables(relevant_table_metadata)
        logger.info(f"relevant processed tables: {processed_tables}")

        prompt = f"""Help extract information relevant to a company with the following details: {company_context} from the following documents. Start with the company background info. Then, include information relevant to the market, strategies, and products. Here are the documents: {docs}. After each point, reference the source you got the information from.

        Also list any interesting quantitative metrics or trends based on the following tables: {processed_tables}. Include which table you got information from.

        Cite sources for sentences using the page number from original source document. Do not list sources at the end of the writing.

        Example: "This is a cited sentence. (Source: Luxury Watch Market Size Report, Page 17).

        Format your response as slack markdown.
=======
    async def execute_query_on_pinecone(self, context: str, docsearch: Pinecone) -> str:
        docs = docsearch.similarity_search(context, k=7)

        prompt = f"""
        Help extract information relevant to a company with the following details: {context} from the following documents. Include information relevant to the market, strategies, and products. Here are the documents: {docs}. After each point, reference the source you got each piece of information from (cite the source). If there's multiple sources, include information from all sources.
>>>>>>> parent of 0fea00c (read and extract info from pdf tables)
        """

        llm = create_model(
            ModelSettings(model="gpt-3.5-turbo-16k", max_tokens=2000),
            UserBase(id="", name=None, email="test@example.com"),
            streaming=False,
        )

        return await load_qa_chain(llm).arun(input_documents=docs, question=prompt)
