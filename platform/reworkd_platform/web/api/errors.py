class PlatformaticError(Exception):
    """
    Parent exception class for all expected backend exceptions
    Will be caught and handled by the platform_exception_handler
    Shoutout to https://platformatic.dev/
    """

    detail: str
    code: int
    should_log: bool = True

    def __init__(
        self,
        base_exception: Exception,
        detail: str = "",
        code: int = 409,
        should_log: bool = True,
    ):
        super().__init__(base_exception)
        self.detail = detail
        self.code = code
        self.should_log = should_log


class OpenAIError(PlatformaticError):
    pass


class ReplicateError(PlatformaticError):
    pass


class MaxLoopsError(PlatformaticError):
    pass


class MultipleSummaryError(PlatformaticError):
    pass
