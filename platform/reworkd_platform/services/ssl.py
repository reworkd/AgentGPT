from ssl import create_default_context

from reworkd_platform.settings import Settings

MACOS_CERT_PATH = "/etc/ssl/cert.pem"
DOCKER_CERT_PATH = "/etc/ssl/certs/ca-certificates.crt"


def get_ssl_context(settings: Settings):
    if settings.db_ca_path:
        return create_default_context(cafile=settings.db_ca_path)

    for path in (MACOS_CERT_PATH, DOCKER_CERT_PATH):
        try:
            return create_default_context(cafile=path)
        except FileNotFoundError:
            continue

    raise FileNotFoundError("No CA certificates found for your OS.")
