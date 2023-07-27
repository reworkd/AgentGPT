from typing import TypeVar

from sqlalchemy.ext.asyncio import AsyncSession

T = TypeVar("T", bound="BaseCrud")


class BaseCrud:
    def __init__(self, session: AsyncSession):
        self.session = session
