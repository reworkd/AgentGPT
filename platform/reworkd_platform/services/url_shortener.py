import aiohttp
import urllib
import urllib.parse


class UrlShortenerService:
    def __init__(self, shortener_url: str = "https://is.gd/create.php"):
        self.shortener_url = shortener_url

    async def get_shortened_url(self, url: str) -> str:
        # Create the full API URL with the URL parameter encoded
        api_url = (
            self.shortener_url
            + "?"
            + urllib.parse.urlencode({"url": url, "format": "simple"})
        )

        async with aiohttp.ClientSession() as session:
            async with session.get(api_url) as response:
                if response.status == 200:
                    return await response.text()
                else:
                    raise ValueError(
                        f"Failed to shorten the URL. Status: {response.status}"
                    )
