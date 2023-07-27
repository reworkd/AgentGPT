from sqlalchemy.ext.asyncio import AsyncSession


class BaseCrud:
    def __init__(self, session: AsyncSession):
        self.session = session
