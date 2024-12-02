FROM python:3.10-slim-bookworm AS base

WORKDIR /app/realtime

RUN apt-get update \
    && apt-get install -y --no-install-recommends vim procps nodejs npm \
    && apt-get autoremove -y \
    && rm -rf /var/lib/apt/lists/* \
    && npm install -g pnpm
    
FROM base AS production

WORKDIR /app/realtime

COPY . /app/realtime

RUN rm /app/realtime/agent/.env \
    && rm /app/realtime/web/.env.local \
    &&chmod +x /app/realtime/agent/.venv/bin/activate \
    && . /app/realtime/agent/.venv/bin/activate \
    && pip install -r /app/realtime/agent/requirements.txt

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/bin/bash", "/entrypoint.sh"]
# CMD ["tail", "-f", "/dev/null"]


