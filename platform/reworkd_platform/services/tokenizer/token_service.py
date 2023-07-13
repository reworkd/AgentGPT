from tiktoken import Encoding

from reworkd_platform.schemas.agent import LLM_MODEL_MAX_TOKENS
from reworkd_platform.web.api.agent.model_settings import WrappedChatOpenAI


class TokenService:
    def __init__(self, encoding: Encoding):
        self.encoding = encoding

    def tokenize(self, text: str) -> list[int]:
        return self.encoding.encode(text)

    def detokenize(self, tokens: list[int]) -> str:
        return self.encoding.decode(tokens)

    def count(self, text: str) -> int:
        return len(self.tokenize(text))

    def calculate_max_tokens(self, model: WrappedChatOpenAI, *prompts: str) -> None:
        max_allowed_tokens = LLM_MODEL_MAX_TOKENS.get(model.model_name, 4000)
        prompt_tokens = sum([self.count(p) for p in prompts])
        requested_tokens = max_allowed_tokens - prompt_tokens

        model.max_tokens = min(model.max_tokens, requested_tokens)
        model.max_tokens = max(model.max_tokens, 1)
