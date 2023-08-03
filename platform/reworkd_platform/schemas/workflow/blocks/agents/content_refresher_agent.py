import re
from typing import Any

import requests
from bs4 import BeautifulSoup
from loguru import logger
from scrapingbee import ScrapingBeeClient

from reworkd_platform.schemas.workflow.base import Block, BlockIOBase
from reworkd_platform.services.anthropic import ClaudeService, HumanAssistantPrompt
from reworkd_platform.settings import settings


class ContentRefresherInput(BlockIOBase):
    url: str


class ContentRefresherOutput(ContentRefresherInput):
    original_content: str
    refreshed_content: str


class ContentRefresherAgent(Block):
    type = "ContentRefresherAgent"
    description = "Refresh the content on an existing page"
    input: ContentRefresherInput

    async def run(self, workflow_id: str, **kwargs: Any) -> ContentRefresherOutput:
        logger.info(f"Starting {self.type}")
        target_url = self.input.url

        target_content = await get_page_content(target_url)
        logger.info(target_content)

        keywords = await find_content_kws(target_content)
        logger.info(keywords)

        sources = search_results(keywords)
        sources = [
            (url, title) for url, title in sources if url != target_url
        ]  # TODO: check based on content overlap
        logger.info(sources)

        source_contents = [
            (url, title, await get_page_content(url)) for url, title in sources[:3]
        ]

        source_contents = [
            (url, title, page_content)
            for url, title, page_content in source_contents
            if page_content is not None
        ]
        logger.info(source_contents)

        new_info = [
            await find_new_info(target_content, source_content)
            for source_content in source_contents
        ]

        new_infos = "\n\n".join(new_info)
        logger.info(new_infos)

        updated_target_content = await add_info(target_content, new_infos)
        logger.info(updated_target_content)

        return ContentRefresherOutput(
            **self.input.dict(),
            original_content=target_content,
            refreshed_content=updated_target_content,
        )


scraper = ScrapingBeeClient(
    api_key=settings.scrapingbee_api_key,
)

claude = ClaudeService(
    api_key=settings.anthropic_api_key,
)


async def get_page_content(url: str) -> str:
    page = requests.get(url)
    if page.status_code != 200:
        page = scraper.get(url)

    html = BeautifulSoup(page.content, "html.parser")

    pgraphs = html.find_all("p")
    pgraphs = "\n".join(
        [
            f"{i + 1}. " + re.sub(r"\s+", " ", p.text).strip()
            for i, p in enumerate(pgraphs)
        ]
    )

    prompt = HumanAssistantPrompt(
        human_prompt=f"Below is a numbered list of the text in all the <p> tags on a web page:\n{pgraphs}\nSome of these lines may not be part of the main content of the page (e.g. footer text, ads, etc). Please list the line numbers that *are* part of the main content (i.e. the article's paragraphs) of the page. You can list consecutive line numbers as a range (e.g. 23-27) and separated by a comma.",
        assistant_prompt="Here are the line numbers of the main content:",
    )

    line_nums = await claude.completion(
        prompt=prompt,
        max_tokens_to_sample=500,
        temperature=0,
    )

    if len(line_nums) == 0:
        return ""

    pgraphs = pgraphs.split("\n")
    content = []
    for line_num in line_nums.split(","):
        if "-" in line_num:
            start, end = map(int, line_num.split("-"))
            for i in range(start, end + 1):
                text = ".".join(pgraphs[i - 1].split(".")[1:]).strip()
                content.append(text)
        else:
            text = ".".join(pgraphs[int(line_num) - 1].split(".")[1:]).strip()
            content.append(text)

    return "\n".join(content)


async def find_content_kws(content: str) -> str:
    # Claude: find search keywords that content focuses on
    prompt = HumanAssistantPrompt(
        human_prompt=f"Below is content from a web article:\n{content}\nPlease list the keywords that best describe the content of the article. Format them so we can use them to query a search engine effectively.",
        assistant_prompt="Here is a short search query that best matches the content of the article:",
    )

    return await claude.completion(
        prompt=prompt,
        max_tokens_to_sample=20,
    )


def search_results(search_query: str) -> list[tuple[str, str]]:
    # use SERP API
    response = requests.post(
        f"https://google.serper.dev/search",
        headers={
            "X-API-KEY": settings.serp_api_key or "",
            "Content-Type": "application/json",
        },
        params={
            "q": search_query,
        },
    )
    response.raise_for_status()
    source_information = [
        (result["link"], result["title"]) for result in response.json()["organic"]
    ]
    return source_information


async def find_new_info(target: str, source: tuple[str, str, str]) -> str:
    source_info = f"{source[0]}, {source[1]}"
    source_content = source[2]

    # Claude: info mentioned in source that is not mentioned in target
    prompt = HumanAssistantPrompt(
        human_prompt=f"Below is the TARGET article:\n{target}\n----------------\nBelow is the SOURCE article:\n{source_content}\n----------------\nIn a bullet point list, identify all facts, figures, or ideas that are mentioned in the SOURCE article but not in the TARGET article. Under the list, write a source citation (you MUST include the url AND full source title provided below: \n{source_info}",
        assistant_prompt="Here is a list of claims in the SOURCE that are not in the TARGET:",
    )

    response = await claude.completion(
        prompt=prompt,
        max_tokens_to_sample=5000,
    )

    new_info = "\n".join(response.split("\n\n"))
    return new_info


async def add_info(target: str, info: str) -> str:
    # Claude: rewrite target to include the info
    prompt = HumanAssistantPrompt(
        human_prompt=f"Below are notes from some SOURCE articles:\n{info}\n----------------\nBelow is the TARGET article:\n{target}\n----------------\nPlease rewrite the TARGET article to include the information from the SOURCE articles. Maintain the format of the TARGET article. At the end of the article, include a list of sources (source url, title, and any additional information) ONLY for added information from SOURCE articles using the following example format: 'Source: https://www.wisnerbaum.com/prescription-drugs/gardasil-lawsuit/, Gardasil Vaccine Lawsuit Update August 2023 - Wisner Baum' Do not add citations for any info in the TARGET article.",
        assistant_prompt="Here is a rewritten version of the target article that incorporates relevant information from the source articles:",
    )

    return await claude.completion(
        prompt=prompt,
        max_tokens_to_sample=5000,
    )
