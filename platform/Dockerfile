FROM python:3.11-slim-buster as prod

RUN apt-get update && apt-get install -y \
  default-libmysqlclient-dev \
  gcc \
  && rm -rf /var/lib/apt/lists/*

RUN pip install poetry==1.4.2

# Configuring poetry
RUN poetry config virtualenvs.create false

# Copying requirements of a project
COPY pyproject.toml /app/src/
WORKDIR /app/src

# Installing requirements
RUN poetry install --only main
# Removing gcc
RUN apt-get purge -y \
  gcc \
  && rm -rf /var/lib/apt/lists/*

# Copying actual application
COPY . /app/src/

CMD ["/usr/local/bin/python", "-m", "reworkd_platform"]

FROM prod as dev

RUN poetry install
