from typing import Any, Optional

from anthropic import AsyncAnthropic
from pydantic import BaseModel


class AbstractPrompt(BaseModel):
    def to_string(self) -> str:
        raise NotImplementedError


class HumanAssistantPrompt(AbstractPrompt):
    assistant_prompt: str
    human_prompt: str

    def to_string(self) -> str:
        return (
            f"""\n\nHuman: {self.human_prompt}\n\nAssistant: {self.assistant_prompt}"""
        )


class ClaudeService:
    def __init__(self, api_key: Optional[str], model: str = "claude-2"):
        self.claude = AsyncAnthropic(api_key=api_key)
        self.model = model

    async def completion(
        self,
        prompt: AbstractPrompt,
        max_tokens_to_sample: int,
        temperature: int = 0,
        **kwargs: Any,
    ) -> str:
        return (
            await self.claude.completions.create(
                model=self.model,
                prompt=prompt.to_string(),
                max_tokens_to_sample=max_tokens_to_sample,
                temperature=temperature,
                **kwargs,
            )
        ).completion.strip()
