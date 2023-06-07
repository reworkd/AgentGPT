from langchain import PromptTemplate
from tiktoken import Encoding


class TokenService:
    def __init__(self, encoding: Encoding):
        self.encoding = encoding

    def tokenize(self, text: str) -> list[int]:
        return self.encoding.encode(text)

    def detokenize(self, tokens: list[int]) -> str:
        return self.encoding.decode(tokens)

    def token_count(self, text: str) -> int:
        return len(self.tokenize(text))

    def prompt_token_count(self, prompt: PromptTemplate, **kwargs) -> int:
        return self.token_count(prompt.format_prompt(**kwargs).to_string())

    def get_context_space(
        self, prompt: str, max_tokens: int, reserved_response_tokens: int
    ) -> int:
        prompt_tokens = self.token_count(prompt)

        return max_tokens - prompt_tokens - reserved_response_tokens

    def get_prompt_context_space(
        self,
        prompt: PromptTemplate,
        max_tokens: int,
        reserved_response_tokens: int,
        **kwargs
    ) -> int:
        return self.get_context_space(
            prompt.format_prompt(**kwargs).to_string(),
            max_tokens,
            reserved_response_tokens,
        )
