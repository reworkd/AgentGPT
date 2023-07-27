from typing import TypeVar

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from reworkd_platform.db.dependencies import get_db_session

T = TypeVar("T", bound="BaseCrud")


class BaseCrud:
    def __init__(self, session: AsyncSession):
        self.session = session

    @classmethod
    async def inject(
        cls,
        session: AsyncSession = Depends(get_db_session),
    ) -> T:
        return cls(session)
