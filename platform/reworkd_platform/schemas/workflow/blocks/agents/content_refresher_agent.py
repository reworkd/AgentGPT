import re
from typing import Any, Callable, Dict, List

import requests
from bs4 import BeautifulSoup
from loguru import logger
from scrapingbee import ScrapingBeeClient

from reworkd_platform.schemas.workflow.base import Block, BlockIOBase
from reworkd_platform.services.anthropic import ClaudeService, HumanAssistantPrompt
from reworkd_platform.services.sockets import websockets
from reworkd_platform.settings import settings


class ContentRefresherInput(BlockIOBase):
    url: str
    competitors: str


class ContentRefresherOutput(ContentRefresherInput):
    original_content: str
    refreshed_report: str
    refreshed_bullet_points: str


class ContentRefresherAgent(Block):
    type = "ContentRefresherAgent"
    description = "Refresh the content on an existing page"
    input: ContentRefresherInput

    async def run(self, workflow_id: str, **kwargs: Any) -> ContentRefresherOutput:
        def log(msg: Any) -> None:
            websockets.log(workflow_id, msg)

        logger.info(f"Starting {self.type}")
        log(f"Starting {self.type} for {self.input.url}")
        target_url = self.input.url

        target_content = await get_page_content(target_url)
        log("Extracting content from provided URL")

        keywords = await find_content_kws(target_content)
        log("Finding keywords from source content")
        log("\n".join([f"- {keyword}" for keyword in keywords.split(" ")]))

        sources = search_results(keywords)
        sources = [
            source for source in sources if source["url"] != target_url
        ]  # TODO: check based on content overlap

        log("Finding sources to refresh content")
        log("\n".join([f"- {source['title']}: {source['url']}" for source in sources]))

        if self.input.competitors:
            log("Removing competitors from sources")
            competitors = self.input.competitors.split(",")
            sources = remove_competitors(sources, competitors, log)

        for source in sources[:3]:  # TODO: remove limit of 3 sources
            source["content"] = await get_page_content(source["url"])

        source_contents = [
            source for source in sources if source.get("content", None) is not None
        ]

        new_info = [
            await find_new_info(target_content, source_content, log)
            for source_content in source_contents
        ]

        new_infos = "\n\n".join(new_info)
        log("Extracting new, relevant information not present in your content")
        log(new_infos)

        log("Updating provided content with new information")
        updated_target_content = await add_info(target_content, new_infos)
        # logger.info(updated_target_content)
        log("Content refresh concluded")

        return ContentRefresherOutput(
            **self.input.dict(),
            original_content=target_content,
            refreshed_report=updated_target_content,
            refreshed_bullet_points=new_infos
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


def search_results(search_query: str) -> List[Dict[str, str]]:
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
        {
            "url": result.get("link", None),
            "title": result.get("title", None),
            "date": result.get("date", None),
        }
        for result in response.json().get("organic", [])
    ]
    return source_information


def remove_competitors(
    sources: List[Dict[str, str]], competitors: List[str], log: Callable[[str], None]
) -> List[Dict[str, str]]:
    normalized_competitors = [comp.replace(" ", "").lower() for comp in competitors]
    competitor_pattern = re.compile(
        "|".join(re.escape(comp) for comp in normalized_competitors)
    )
    filtered_sources = []
    for source in sources:
        if competitor_pattern.search(
            source["url"].replace(" ", "").lower()
        ) or competitor_pattern.search(source["title"].replace(" ", "").lower()):
            log(f"Removing source due to competitor match:, '{source['title']}'")
        else:
            filtered_sources.append(source)

    return filtered_sources


async def find_new_info(
    target: str, source: Dict[str, str], log: Callable[[str], None]
) -> str:
    source_metadata = f"{source['url']}, {source['title']}" + (
        f", {source['date']}" if source["date"] else ""
    )
    source_content = source["content"]

    # Claude: info mentioned in source that is not mentioned in target
    prompt = HumanAssistantPrompt(
        human_prompt=f"Below is the TARGET article:\n{target}\n----------------\nBelow is the SOURCE article:\n{source_content}\n----------------\nIn a bullet point list, identify all facts, figures, or ideas that are mentioned in the SOURCE article but not in the TARGET article.",
        assistant_prompt="Here is a list of claims in the SOURCE that are not in the TARGET:",
    )
    log(f"Identifying new details to refresh with from '{source['title']}'")

    response = await claude.completion(
        prompt=prompt,
        max_tokens_to_sample=5000,
    )

    new_info = "\n".join(response.split("\n\n"))
    new_info += "\n" + source_metadata
    return new_info


async def add_info(target: str, info: str) -> str:
    # Claude: rewrite target to include the info
    prompt = HumanAssistantPrompt(
        human_prompt=f"Below are notes from some SOURCE articles:\n{info}\n----------------\nBelow is the TARGET article:\n{target}\n----------------\nPlease rewrite the TARGET article to include the information from the SOURCE articles. Maintain the format of the TARGET article. Don't remove any details from the TARGET article, unless you are refreshing that specific content with new information. After any new source info that is added to target, include inline citations using the following example format: 'So this is a cited sentence at the end of a paragraph[1](https://www.wisnerbaum.com/prescription-drugs/gardasil-lawsuit/, Gardasil Vaccine Lawsuit Update August 2023 - Wisner Baum).' Do not add citations for any info in the TARGET article. Do not list citations separately at the end of the response",
        assistant_prompt="Here is a rewritten version of the target article that incorporates relevant information from the source articles:",
    )

    return await claude.completion(
        prompt=prompt,
        max_tokens_to_sample=5000,
    )
