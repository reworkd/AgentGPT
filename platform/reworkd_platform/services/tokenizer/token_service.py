from tiktoken import Encoding, get_encoding

from reworkd_platform.schemas.agent import LLM_MODEL_MAX_TOKENS, LLM_Model
from reworkd_platform.web.api.agent.model_factory import WrappedChatOpenAI
from reworkd_platform.logging import logger


class TokenService:
    def __init__(self, encoding: Encoding):
        self.encoding = encoding
        logger.info("TokenService initialized with encoding: {}", encoding.name)

    @classmethod
    def create(cls, encoding: str = "cl100k_base") -> "TokenService":
        logger.info("Creating TokenService with encoding: {}", encoding)
        return cls(get_encoding(encoding))

    def tokenize(self, text: str) -> list[int]:
        logger.debug("Tokenizing text: {}", text)
        tokens = self.encoding.encode(text)
        logger.debug("Tokenized text to tokens: {}", tokens)
        return tokens

    def detokenize(self, tokens: list[int]) -> str:
        logger.debug("Detokenizing tokens: {}", tokens)
        text = self.encoding.decode(tokens)
        logger.debug("Detokenized tokens to text: {}", text)
        return text

    def count(self, text: str) -> int:
        logger.debug("Counting tokens in text: {}", text)
        count = len(self.tokenize(text))
        logger.debug("Counted {} tokens in text", count)
        return count

    def get_completion_space(self, model: LLM_Model, *prompts: str) -> int:
        logger.info("Calculating completion space for model: {} with prompts: {}", model, prompts)
        max_allowed_tokens = LLM_MODEL_MAX_TOKENS.get(model, 4000)
        prompt_tokens = sum([self.count(p) for p in prompts])
        completion_space = max_allowed_tokens - prompt_tokens
        logger.info("Calculated completion space: {}", completion_space)
        return completion_space

    def calculate_max_tokens(self, model: WrappedChatOpenAI, *prompts: str) -> None:
        logger.info("Calculating max tokens for model: {} with prompts: {}", model.model_name, prompts)
        requested_tokens = self.get_completion_space(model.model_name, *prompts)

        if model.max_tokens is None:
            model.max_tokens = requested_tokens

        model.max_tokens = min(model.max_tokens, requested_tokens)
        model.max_tokens = max(model.max_tokens, 1)
        logger.info("Calculated max tokens for model: {}", model.max_tokens)
