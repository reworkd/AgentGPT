from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
def health_check() -> None:
    """
    Checks the health of a project.

    It returns 200 if the project is healthy.
    """


@router.get("/error")
def error_check() -> None:
    """
    Checks that errors are being correctly logged.
    """
    raise Exception("This is an expected error from the error check endpoint!")
