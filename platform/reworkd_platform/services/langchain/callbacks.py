from typing import Dict, Any, Optional
from uuid import UUID

from fastapi import Depends
from langchain import PromptTemplate
from langchain.callbacks.base import AsyncCallbackHandler
from loguru import logger


class CallbackHandler(AsyncCallbackHandler):
    id: UUID
    prompt: str = ""
    model: str = ""

    def __init__(
        self,
    ):
        super().__init__()

    @staticmethod
    def inject() -> "CallbackHandler":
        return CallbackHandler()

    async def on_chain_start(
        self,
        serialized: Dict[str, Any],
        inputs: Dict[str, Any],
        *,
        run_id: UUID,
        parent_run_id: Optional[UUID] = None,
        **kwargs: Any,
    ) -> None:
        """Run when chain starts running."""
        # TODO: HOW IS LANGCHAIN WORTH 100M, THIS IS SHIT
        try:
            self.id = run_id
            self.model = serialized["kwargs"]["llm"]["kwargs"]["model"]

            try:
                self.prompt = (
                    PromptTemplate(
                        **serialized["kwargs"]["prompt"]["kwargs"]["messages"][0][
                            "kwargs"
                        ]["prompt"]["kwargs"]
                    )
                    .format_prompt(**inputs)
                    .to_string()
                )
            except KeyError:
                self.prompt = (
                    PromptTemplate(**serialized["kwargs"]["prompt"]["kwargs"])
                    .format_prompt(**inputs)
                    .to_string()
                )
        except Exception as e:
            logger.exception(e)

    async def on_chain_end(
        self,
        outputs: Dict[str, Any],
        *,
        run_id: UUID,
        parent_run_id: Optional[UUID] = None,
        **kwargs: Any,
    ) -> Any:
        """Called when an LLM has finished running."""
        if self.id != run_id:
            raise ValueError("Run ID mismatch")

        if not self.prompt or not self.model:
            raise ValueError(f"Invalid prompt {self.prompt} or model {self.model}")

        await self.producer.send(
            prompt=self.prompt, completion=outputs["text"], model=self.model
        )