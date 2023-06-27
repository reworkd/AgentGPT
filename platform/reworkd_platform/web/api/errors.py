# Parent exception class for all expected backend exceptions
# Will be caught and handled by the platform_exception_handler
# Shoutout https://platformatic.dev/
class PlatformaticError(Exception):
    detail: str
    code: int
    should_log: bool = True

    def __init__(self, base_exception: Exception, detail: str = "", code: int = 409):
        super().__init__(base_exception)
        self.detail = detail
        self.code = code


class OpenAIError(PlatformaticError):
    pass


class ReplicateError(PlatformaticError):
    pass


class MaxLoopsError(PlatformaticError):
    should_log = False


# (Replicate) ModelError: NSFW content detected. Try running it again, or try a different prompt.
# ReplicateError: You've hit your monthly spend limit. You can change or remove your limit at https://replicate.com/account/billing#limits.


# UnicodeEncodeError: 'utf-8' codec can't encode character '\ud800' in position 445: surrogates not allowed

# InvalidRequestError: Engine not found
# TimeoutError -> https://reworkd.sentry.io/issues/4206041431/?project=4505228628525056&query=is%3Aunresolved&referrer=issue-stream&stream_index=17
# ServiceUnavailableError: The server is overloaded or not ready yet.
# ClientPayloadError: Response payload is not completed -> https://reworkd.sentry.io/issues/4209422945/?project=4505228628525056&query=is%3Aunresolved&referrer=issue-stream&stream_index=21
# InvalidRequestError: This model's maximum context length is 4097 tokens. However, your messages resulted in 5238 tokens. Please reduce the length of the messages.
# InvalidRequestError: This model's maximum context length is 8192 tokens. However, you requested 8451 tokens (451 in the messages, 8000 in the completion). Please reduce the length of the messages or completion.
