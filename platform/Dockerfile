FROM python:3.11-slim-buster as prod

RUN apt-get update && apt-get install -y \
  default-libmysqlclient-dev \
  gcc \
  && rm -rf /var/lib/apt/lists/*

RUN pip install poetry==1.4.2

# Configuring poetry
RUN poetry config virtualenvs.create false

# Copying requirements of a project
COPY pyproject.toml poetry.lock /app/src/
WORKDIR /app/src

# Installing requirements
RUN poetry install --only main
# Removing gcc
RUN apt-get purge -y \
  gcc \
  && rm -rf /var/lib/apt/lists/*

# Copying actual application
COPY . /app/src/
RUN poetry install --only main



# Ensure correct line endings after these files are edited by windows
RUN chmod +x /app/src/entrypoint.sh
RUN apt-get update && apt-get install -y netcat-openbsd dos2unix \
    && dos2unix /app/src/entrypoint.sh \
    && apt-get clean && rm -rf /var/lib/apt/lists/*
#ENTRYPOINT ["sh", "entrypoint.sh"]


CMD ["/usr/local/bin/python", "-m", "reworkd_platform"]

FROM prod as dev

RUN poetry install
