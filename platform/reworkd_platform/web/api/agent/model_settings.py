from typing import Optional

from pydantic import BaseModel


class ModelSettings(BaseModel):
    customApiKey: Optional[str] = None
    customModelName: Optional[str] = None
    customTemperature: Optional[float] = None
    customMaxLoops: Optional[int] = None
    maxTokens: Optional[int] = None
