from ssl import SSLContext, create_default_context
from typing import List, Optional

from reworkd_platform.settings import Settings

MACOS_CERT_PATH = "/etc/ssl/cert.pem"
DOCKER_CERT_PATH = "/etc/ssl/certs/ca-certificates.crt"


def get_ssl_context(
    settings: Settings, paths: Optional[List[str]] = None
) -> SSLContext:
    if settings.db_ca_path:
        return create_default_context(cafile=settings.db_ca_path)

    for path in paths or [MACOS_CERT_PATH, DOCKER_CERT_PATH]:
        try:
            return create_default_context(cafile=path)
        except FileNotFoundError:
            continue

    raise ValueError(
        "No CA certificates found for your OS. To fix this, please run change "
        "db_ca_path in your settings.py to point to a valid CA certificate file."
    )
