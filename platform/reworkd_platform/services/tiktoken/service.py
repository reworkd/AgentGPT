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

    def get_context_space(
        self, prompt: str, max_tokens: int, reserved_response_tokens: int
    ) -> int:
        prompt_tokens = self.tokenize(prompt)

        return max_tokens - len(prompt_tokens) - reserved_response_tokens
