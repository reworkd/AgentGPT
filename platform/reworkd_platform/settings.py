import platform
from pathlib import Path
from tempfile import gettempdir
from typing import List, Literal, Optional, Union

from pydantic import BaseSettings
from yarl import URL

from reworkd_platform.constants import ENV_PREFIX

TEMP_DIR = Path(gettempdir())

LOG_LEVEL = Literal[
    "NOTSET",
    "DEBUG",
    "INFO",
    "WARNING",
    "ERROR",
    "FATAL",
]


SASL_MECHANISM = Literal[
    "PLAIN",
    "SCRAM-SHA-256",
]

ENVIRONMENT = Literal[
    "development",
    "production",
]


class Settings(BaseSettings):
    """
    Application settings.

    These parameters can be configured
    with environment variables.
    """

    # Application settings
    host: str = "127.0.0.1"
    port: int = 8000
    workers_count: int = 1
    reload: bool = True
    environment: ENVIRONMENT = "development"
    log_level: LOG_LEVEL = "INFO"

    # Make sure you update this with your own secret key
    # Must be 32 url-safe base64-encoded bytes
    secret_signing_key: str = "JF52S66x6WMoifP5gZreiguYs9LYMn0lkXqgPYoNMD0="

    # OpenAI
    openai_api_base: str = "https://api.openai.com/v1"
    openai_api_key: str = "<Should be updated via env>"
    openai_api_version: str = "2023-08-01-preview"
    azure_openai_deployment_name: str = "<Should be updated via env if using azure>"

    # Helicone
    helicone_api_base: str = "https://oai.hconeai.com/v1"
    helicone_api_key: Optional[str] = None

    replicate_api_key: Optional[str] = None
    serp_api_key: Optional[str] = None

    # Frontend URL for CORS
    frontend_url: str = "http://localhost:3000"
    allowed_origins_regex: Optional[str] = None

    # Variables for the database
    db_host: str = "localhost"
    db_port: int = 3308
    db_user: str = "reworkd_platform"
    db_pass: str = "reworkd_platform"
    db_base: str = "reworkd_platform"
    db_echo: bool = False
    db_ca_path: Optional[str] = None

    # Variables for Pinecone DB
    pinecone_api_key: Optional[str] = None
    pinecone_index_name: Optional[str] = None
    pinecone_environment: Optional[str] = None

    # Sentry's configuration.
    sentry_dsn: Optional[str] = None
    sentry_sample_rate: float = 1.0

    kafka_bootstrap_servers: Union[str, List[str]] = []
    kafka_username: Optional[str] = None
    kafka_password: Optional[str] = None
    kafka_ssal_mechanism: SASL_MECHANISM = "PLAIN"

    # Websocket settings
    pusher_app_id: Optional[str] = None
    pusher_key: Optional[str] = None
    pusher_secret: Optional[str] = None
    pusher_cluster: Optional[str] = None

    # Application Settings
    ff_mock_mode_enabled: bool = False  # Controls whether calls are mocked
    max_loops: int = 25  # Maximum number of loops to run

    # Settings for sid
    sid_client_id: Optional[str] = None
    sid_client_secret: Optional[str] = None
    sid_redirect_uri: Optional[str] = None

    @property
    def kafka_consumer_group(self) -> str:
        """
        Kafka consumer group will be the name of the host in development
        mode, making it easier to share a dev cluster.
        """

        if self.environment == "development":
            return platform.node()

        return "platform"

    @property
    def db_url(self) -> URL:
        return URL.build(
            scheme="mysql+aiomysql",
            host=self.db_host,
            port=self.db_port,
            user=self.db_user,
            password=self.db_pass,
            path=f"/{self.db_base}",
        )

    @property
    def pusher_enabled(self) -> bool:
        return all(
            [
                self.pusher_app_id,
                self.pusher_key,
                self.pusher_secret,
                self.pusher_cluster,
            ]
        )

    @property
    def kafka_enabled(self) -> bool:
        return all(
            [
                self.kafka_bootstrap_servers,
                self.kafka_username,
                self.kafka_password,
            ]
        )

    @property
    def helicone_enabled(self) -> bool:
        return all(
            [
                self.helicone_api_base,
                self.helicone_api_key,
            ]
        )

    @property
    def sid_enabled(self) -> bool:
        return all(
            [
                self.sid_client_id,
                self.sid_client_secret,
                self.sid_redirect_uri,
            ]
        )

    class Config:
        env_file = ".env"
        env_prefix = ENV_PREFIX
        env_file_encoding = "utf-8"


settings = Settings()
