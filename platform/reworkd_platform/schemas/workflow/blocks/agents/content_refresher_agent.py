import re
from typing import Any, Callable, Dict, List, Optional, Tuple

import requests
from bs4 import BeautifulSoup
from loguru import logger
from scrapingbee import ScrapingBeeClient

from reworkd_platform.schemas.workflow.base import Block, BlockIOBase
from reworkd_platform.services.anthropic import HumanAssistantPrompt, ClaudeService
from reworkd_platform.services.serp import SerpService
from reworkd_platform.services.sockets import websockets
from reworkd_platform.settings import settings, Settings


class ContentRefresherInput(BlockIOBase):
    url: str
    competitors: Optional[str] = None
    keywords: Optional[str] = None


class ContentRefresherOutput(ContentRefresherInput):
    original_report: str
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
        return await ContentRefresherService(settings, log).refresh(self.input)


class ContentRefresherService:
    def __init__(self, settings: Settings, log: Callable[[str], None]):
        self.log = log
        self.claude = ClaudeService(api_key=settings.anthropic_api_key)
        self.scraper = ScrapingBeeClient(api_key=settings.scrapingbee_api_key)
        self.serp = SerpService(api_key=settings.serp_api_key)

    async def refresh(self, input_: ContentRefresherInput) -> ContentRefresherOutput:
        target_url = input_.url

        target_content = await self.get_page_content(target_url)
        self.log("Extracting content from provided URL")

        keywords = self.parse_input_keywords(input_.keywords)
        self.log("Parsing keywords from input")

        if len(keywords) < 3:
            additional_keywords = await self.find_content_kws(target_content, keywords)
            keywords.extend(additional_keywords)
            self.log("Finding more keywords from source content")
        self.log("Keywords: " + ", ".join(keywords))

        sources = self.search_results(", ".join(keywords))
        sources = [
            source for source in sources if source["url"] != target_url
        ]  # TODO: check based on content overlap

        self.log("Finding sources to refresh content")
        self.log(
            "\n".join([f"- {source['title']}: {source['url']}" for source in sources])
        )

        if input_.competitors:
            self.log("Removing competitors from sources")
            competitors = input_.competitors.split(",")
            sources = self.remove_competitors(sources, competitors, self.log)

        domain = self.extract_domain(target_url)
        if domain:
            sources = [source for source in sources if domain not in source["url"]]

        self.log(f"Omitting sources from target's domain: {domain}")

        for source in sources[:3]:  # TODO: remove limit of 3 sources
            source["content"] = await self.get_page_content(source["url"])

        source_contents = [
            source for source in sources if source.get("content", None) is not None
        ]

        new_info = [
            await self.find_new_info(target_content, source_content, self.log)
            for source_content in source_contents
        ]

        new_infos = "\n\n".join(new_info)
        self.log("Extracting new, relevant information not present in your content")
        for info in new_info:
            self.log(info)

        self.log("Updating provided content with new information")
        updated_target_content = await self.add_info(target_content, new_infos)
        self.log("Content refresh concluded")

        return ContentRefresherOutput(
            **input_.dict(),
            original_report=target_content,
            refreshed_report=updated_target_content,
            refreshed_bullet_points=new_infos,
        )

    async def get_page_content(self, url: str) -> str:
        page = requests.get(url)
        if page.status_code != 200:
            page = self.scraper.get(url)

        html = BeautifulSoup(page.content, "html.parser")
        pgraphs = self.get_article_from_html(html)

        prompt = HumanAssistantPrompt(
            human_prompt=f"Below is a numbered list of the text in all the <p> and <li> tags on a web page: {pgraphs} Within this list, some lines may not be relevant to the primary content of the page (e.g. footer text, advertisements, etc.). Please identify the range of line numbers that correspond to the main article's content (i.e. article's paragraphs). Your response should only mention the range of line numbers, for example: 'lines 5-25'.",
            assistant_prompt="Given the extracted text, the main content's line numbers are:",
        )

        line_nums = await self.claude.completion(
            prompt=prompt,
            max_tokens_to_sample=500,
            temperature=0,
        )

        if len(line_nums) == 0:
            return ""

        content = self.extract_content_from_line_nums(pgraphs, line_nums)
        return "\n".join(content)

    async def find_content_kws(
        self, content: str, input_keywords: List[str]
    ) -> List[str]:
        # Claude: find search keywords that content focuses on
        num_keywords_to_find = 8 - len(input_keywords)
        prompt = HumanAssistantPrompt(
            human_prompt=f"Below is content from a web article:\n{content}\nPlease list {num_keywords_to_find} keywords that best describe the content of the article. Separate each keyword (or phrase) with commas so we can use them to query a search engine effectively. e.g. 'gardasil lawsuits, gardasil side effects, autoimmune, ovarian.' Here are the existing keywords, choose different ones than the following: {', '.join(input_keywords)}",
            assistant_prompt="Here is a short search query that best matches the content of the article:",
        )

        response = await self.claude.completion(
            prompt=prompt,
            max_tokens_to_sample=20,
        )
        keywords_list = [keyword.strip() for keyword in response.split(",")]

        return keywords_list

    def search_results(self, search_query: str) -> List[Dict[str, str]]:
        source_information = [
            {
                "url": result.get("link", None),
                "title": result.get("title", None),
                "date": result.get("date", None),
            }
            for result in self.serp.search(search_query).get("organic", [])
        ]
        return source_information

    async def find_new_info(
        self, target: str, source: Dict[str, str], log: Callable[[str], None]
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

        response = await self.claude.completion(
            prompt=prompt,
            max_tokens_to_sample=5000,
        )

        new_info = "\n".join(response.split("\n\n"))
        new_info += "\n\nSource: " + source_metadata
        return new_info

    async def add_info(self, target: str, info: str) -> str:
        # Claude: rewrite target to include the info
        prompt = HumanAssistantPrompt(
            human_prompt=f"Below is the TARGET article:\n{target}\n----------------\nBelow are notes from SOURCE articles that are not currently present in the TARGET:\n{info}\n----------------\nPlease rewrite the TARGET article to include unique, new information from the SOURCE articles. The format of the article you write should follow the TARGET article. The goal is to add as many relevant details from SOURCE to TARGET. Don't remove any details from the TARGET article, unless you are refreshing that specific content with new information. After any new source info that is added to target, include inline citations using the following example format: 'So this is a cited sentence at the end of a paragraph[1](https://www.wisnerbaum.com/prescription-drugs/gardasil-lawsuit/, Gardasil Vaccine Lawsuit Update August 2023 - Wisner Baum).' Do not cite info that already existed in the TARGET article. Do not list citations separately at the end of the response",
            assistant_prompt="Here is a rewritten version of the target article that incorporates relevant information from the source articles:",
        )

        response = await self.claude.completion(
            prompt=prompt,
            max_tokens_to_sample=5000,
        )

        response = "\n".join(
            [
                paragraph.strip()
                for paragraph in response.split("\n\n")
                if paragraph.strip()
            ]
        )
        return response

    def extract_content_from_line_nums(self, pgraphs: str, line_nums: str) -> List[str]:
        pgraph_elements = pgraphs.split("\n")
        content = []
        for line_num in line_nums.split(","):
            if "-" in line_num:
                start, end = self.extract_initial_line_numbers(line_num)
                if start and end:
                    for i in range(start, min(end + 1, len(pgraph_elements) + 1)):
                        text = ".".join(pgraph_elements[i - 1].split(".")[1:]).strip()
                        content.append(text)
            elif line_num.isdigit():
                text = ".".join(
                    pgraph_elements[int(line_num) - 1].split(".")[1:]
                ).strip()
                content.append(text)
        return content

    @staticmethod
    def extract_domain(url: str) -> Optional[str]:
        if "." not in url:
            return None

        domain_extraction_pattern = (
            r"^(?:https?://)?(?:[^/]+\.)?([^/]+\.[A-Za-z_0-9.-]+).*"
        )
        match = re.search(domain_extraction_pattern, url)
        if match:
            return match.group(1)
        else:
            return None

    @staticmethod
    def remove_competitors(
        sources: List[Dict[str, str]],
        competitors: List[str],
        log: Callable[[str], None],
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
                log(f"Removing competitive source: '{source['title']}'")
            else:
                filtered_sources.append(source)

        return filtered_sources

    @staticmethod
    def extract_initial_line_numbers(
        line_nums: str,
    ) -> Tuple[Optional[int], Optional[int]]:
        match = re.search(r"(\d+)-(\d+)", line_nums)
        if match:
            return int(match.group(1)), int(match.group(2))
        else:
            return None, None

    @staticmethod
    def get_article_from_html(html: BeautifulSoup) -> str:
        elements = []
        processed_lists = set()
        for p in html.find_all("p"):
            elements.append(p)
            next_sibling = p.find_next_sibling(["ul", "ol"])
            if next_sibling and next_sibling not in processed_lists:
                elements.extend(next_sibling.find_all("li"))
                processed_lists.add(next_sibling)

        if not elements:
            return "No <p> or <li> tags found on page"

        formatted_elements = []
        for i, element in enumerate(elements):
            text = re.sub(r"\s+", " ", element.text).strip()
            prefix = f"{i + 1}. "
            if element.name == "li":
                prefix += "• "
            formatted_elements.append(f"{prefix}{text}")

        return "\n".join(formatted_elements)

    @staticmethod
    def parse_input_keywords(input_keywords: Optional[str]) -> List[str]:
        if not input_keywords:
            return []

        keywords = [
            keyword.strip() for keyword in input_keywords.split(",") if keyword.strip()
        ]

        return keywords
