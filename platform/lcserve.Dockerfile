# This file is used by `lc-serve` to build the image. 
# Don't change the name of this file or add an entrypoint.

FROM jinawolf/serving-gateway:${version}

RUN apt-get update && apt-get install -y \
  default-libmysqlclient-dev \
  gcc \
  && rm -rf /var/lib/apt/lists/*

COPY . /appdir/

RUN pip install poetry==1.4.2 && cd /appdir && \
    poetry config virtualenvs.create false && \
    poetry install --only main && \
    pip uninstall -y poetry && \
    apt-get remove --auto-remove -y gcc && \
    apt-get autoremove && apt-get clean && rm -rf /var/lib/apt/lists/* && rm -rf /tmp/*
