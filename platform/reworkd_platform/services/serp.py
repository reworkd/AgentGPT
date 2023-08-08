from typing import Optional, Any, Dict

import requests


class SerpService:
    def __init__(self, api_key: Optional[str]):
        self.api_key = api_key

    def search(self, query: str) -> Dict[str, Any]:
        if not self.api_key:
            raise ValueError("No API key provided")

        response = requests.post(
            f"https://google.serper.dev/search",
            headers={
                "X-API-KEY": self.api_key,
                "Content-Type": "application/json",
            },
            params={
                "q": query,
            },
        )
        response.raise_for_status()
        return response.json()
