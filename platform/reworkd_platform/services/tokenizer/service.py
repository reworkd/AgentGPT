from tiktoken import Encoding


class TokenService:
    def __init__(self, encoding: Encoding):
        self.encoding = encoding

    def tokenize(self, text: str) -> list[int]:
        return self.encoding.encode(text)

    def detokenize(self, tokens: list[int]) -> str:
        return self.encoding.decode(tokens)

    def count(self, text: str) -> int:
        return len(self.tokenize(text))
