from typing import Optional

from pydantic import BaseModel


class UserBase(BaseModel):
    id: str
    name: Optional[str]
    email: Optional[str]
