from loguru import logger
from reworkd_platform.settings import settings
from reworkd_platform.schemas.workflow.base import Block, BlockIOBase

import re
import requests
from scrapingbee import ScrapingBeeClient
from bs4 import BeautifulSoup
import anthropic


class ContentRefresherInput(BlockIOBase):
    url: str


class ContentRefresherOutput(ContentRefresherInput):
    original_content: str
    refreshed_content: str


class ContentRefresherAgent(Block):
    type = "ContentRefresherAgent"
    description = "Refresh the content on an existing page"
    input: ContentRefresherInput

    async def run(self) -> BlockIOBase:
        logger.info(f"Starting {self.type}")
        target_url = self.input.url

        target_content = get_page_content(target_url)
        logger.info(target_content)

        keywords = find_content_kws(target_content)
        logger.info(keywords)

        source_urls = search_results(keywords)
        if target_url in source_urls:  # TODO: check based on content overlap
            source_urls.remove(target_url)
        logger.info(source_urls)

        source_contents = [
            get_page_content(url)
            for url in source_urls[:3]  # TODO: remove limit of 3 sources
        ]  # TODO: async/multithread the LLM calls
        source_contents = [
            content for content in source_contents if content is not None
        ]
        logger.info(source_contents)

        new_infos = "\n\n".join(
            [
                find_new_info(target_content, source_content)
                for source_content in source_contents
            ]
        )
        logger.info(new_infos)

        updated_target_content = add_info(target_content, new_infos)
        logger.info(updated_target_content)

        return ContentRefresherOutput(
            **self.input.dict(),
            original_content=target_content,
            refreshed_content=updated_target_content,
        )


scraper = ScrapingBeeClient(
    api_key=settings.scrapingbee_api_key,
)
claude = anthropic.Anthropic(
    api_key=settings.anthropic_api_key,
)


def get_page_content(url: str) -> str:
    page = requests.get(url)
    if page.status_code != 200:
        page = scraper.get(url)

    html = BeautifulSoup(page.content, "html.parser")

    pgraphs = html.find_all("p")
    pgraphs = "\n".join(
        [
            f"{i+1}. " + re.sub(r"\s+", " ", p.text).strip()
            for i, p in enumerate(pgraphs)
        ]
    )

    prompt = f"Below is a numbered list of the text in all the <p> tags on a web page:\n{pgraphs}\nSome of these lines may not be part of the main content of the page (e.g. footer text, ads, etc). Please list the line numbers that *are* part of the main content (i.e. the article's paragraphs) of the page. You can list consecutive line numbers as a range (e.g. 23-27) and separated by a comma."
    response = claude.completions.create(
        model="claude-2",
        prompt=f"\n\nHuman: {prompt}\n\nAssistant: Here are the line numbers of the main content:",
        max_tokens_to_sample=500,
        temperature=0,
    )
    line_nums = response.completion.strip()
    if len(line_nums) == 0:
        return ''

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


def find_content_kws(content: str) -> str:
    # Claude: find search keywords that content focuses on
    prompt = f"Below is content from a web article:\n{content}\nPlease list the keywords that best describe the content of the article. Format them so we can use them to query a search engine effectively."
    response = claude.completions.create(
        model="claude-2",
        prompt=f"\n\nHuman: {prompt}\n\nAssistant: Here is a short search query that best matches the content of the article:",
        max_tokens_to_sample=20,
        temperature=0,
    )
    response_message = response.completion.strip()
    return response_message


def search_results(search_query: str) -> list[str]:
    # use SERP API
    response = requests.post(
        f"https://google.serper.dev/search",
        headers={
            "X-API-KEY": settings.serp_api_key or '',
            "Content-Type": "application/json",
        },
        params={
            "q": search_query,
        },
    )
    response.raise_for_status()
    search_results = response.json()
    urls = [result["link"] for result in search_results["organic"]]
    return urls


def find_new_info(target: str, source: str) -> str:
    # Claude: info mentioned in source that is not mentioned in target
    prompt = f"Below is the TARGET article:\n{target}\n----------------\nBelow is the SOURCE article:\n{source}\n----------------\nIn a bullet point list, identify all facts, figures, or ideas that are mentioned in the SOURCE article but not in the TARGET article."
    response = claude.completions.create(
        model="claude-2",
        prompt=f"\n\nHuman: {prompt}\n\nAssistant: Here is a list of claims in the SOURCE that are not in the TARGET:",
        max_tokens_to_sample=5000,
        temperature=0,
    )
    response_message = response.completion.strip()
    new_info = "\n".join(response_message.split("\n\n"))
    return new_info


def add_info(target: str, info: str) -> str:
    # Claude: rewrite target to include the info
    prompt = f"Below are notes from some SOURCE articles:\n{info}\n----------------\nBelow is the TARGET article:\n{target}\n----------------\nPlease rewrite the TARGET article to include the information from the SOURCE articles."
    response = claude.completions.create(
        model="claude-2",
        prompt=f"\n\nHuman: {prompt}\n\nAssistant: Here is a rewritten version of the target article that incorporates relevant information from the source articles:",
        max_tokens_to_sample=5000,
        temperature=0,
    )
    response_message = response.completion.strip()
    return response_message


if __name__ == "main":
    print("MAIN")
    agent = ContentRefresherAgent(
        id="test",
        type="ContentRefresherAgent",
        input=ContentRefresherInput(
            url="https://www.science.org/content/article/embattled-physicist-files-patent-unprecedented-ambient-superconductor"
        )
    )
    output = agent.run()
    print(output)
