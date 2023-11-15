from typing import Any, Dict, Optional, Tuple, Type, Union

from langchain.chat_models import AzureChatOpenAI, ChatOpenAI, QianfanChatEndpoint
from pydantic import Field

from reworkd_platform.schemas.agent import LLM_Model, ModelSettings
from reworkd_platform.schemas.user import UserBase
from reworkd_platform.settings import Settings


class WrappedChatOpenAI(ChatOpenAI):
    """ChatOpenAI with client field.
    """
    client: Any = Field(
        default=None,
        description="Meta private value but mypy will complain its missing",
    )
    max_tokens: int
    model_name: LLM_Model = Field(alias="model")


class WrappedAzureChatOpenAI(AzureChatOpenAI, WrappedChatOpenAI):
    """AzureChatOpenAI with WrappedChatOpenAI
    """
    openai_api_base: str
    openai_api_version: str
    deployment_name: str


class WrappedQianfanChatEndpoint(QianfanChatEndpoint):
    """QianfanChatEndpoint with WrappedChatOpenAI
    """
    client: Any = Field(
        default=None,
        description="Meta private value but mypy will complain its missing",
    )
    max_tokens: int
    model_name: LLM_Model = Field(alias="model")

    qianfan_endpoint: str
    qianfan_ak: str
    qianfan_sk: str


WrappedChat = Union[WrappedAzureChatOpenAI, WrappedChatOpenAI, WrappedQianfanChatEndpoint]


def create_model(
    settings: Settings,
    model_settings: ModelSettings,
    user: UserBase,
    streaming: bool = False,
    force_model: Optional[LLM_Model] = None,
) -> WrappedChat:
    """
    创建聊天模型。

    参数：
    - settings: 设置参数
    - model_settings: 模型设置参数
    - user: 用户参数
    - streaming: 是否开启流式处理，默认为False
    - force_model: 强制使用的模型，默认为None

    返回：
    - WrappedChat: 聊天模型对象

    """

    use_azure = (
        not model_settings.custom_api_key and "azure" in settings.openai_api_base
    )
    use_qianfan = (
        "qianfan_ak" in settings and "qianfan_sk" in settings
    )

    llm_model = force_model or model_settings.model
    model: Type[WrappedChat] = WrappedChatOpenAI
    base, headers, use_helicone = get_base_and_headers(settings, model_settings, user)
    kwargs = {
        "openai_api_base": base,
        "openai_api_key": model_settings.custom_api_key or settings.openai_api_key,
        "temperature": model_settings.temperature,
        "model": llm_model,
        "max_tokens": model_settings.max_tokens,
        "streaming": streaming,
        "max_retries": 5,
        "model_kwargs": {"user": user.email, "headers": headers},
        "openai_proxy": settings.openai_proxy,
    }

    if use_azure:
        model = WrappedAzureChatOpenAI
        deployment_name = llm_model.replace(".", "")
        kwargs.update(
            {
                "openai_api_version": settings.openai_api_version,
                "deployment_name": deployment_name,
                "openai_api_type": "azure",
                "openai_api_base": base.rstrip("v1"),
            },
        )

        if use_helicone:
            kwargs["model"] = deployment_name

    if use_qianfan:
        model = WrappedQianfanChatEndpoint

    return model(**kwargs)  # type: ignore


def get_base_and_headers(
    settings_: Settings, model_settings: ModelSettings, user: UserBase,
) -> Tuple[str, Optional[Dict[str, str]], bool]:
    use_helicone = settings_.helicone_enabled and not model_settings.custom_api_key
    base = (
        settings_.helicone_api_base
        if use_helicone
        else (
            "https://api.openai.com/v1"
            if model_settings.custom_api_key
            else settings_.openai_api_base
        )
    )

    headers = (
        {
            "Helicone-Auth": f"Bearer {settings_.helicone_api_key}",
            "Helicone-Cache-Enabled": "true",
            "Helicone-User-Id": user.id,
            "Helicone-OpenAI-Api-Base": settings_.openai_api_base,
        }
        if use_helicone
        else None
    )

    return base, headers, use_helicone
