# Postgres with the postgis and pgvector extensions the app's migrations
# require (see apps/api/prisma/migrations/*_add_postgis and *_enable_pgvector).
# The official postgres image already configures the PGDG apt repo, which
# carries both packages for the matching major version.
FROM postgres:16

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    postgresql-16-postgis-3 \
    postgresql-16-pgvector \
  && rm -rf /var/lib/apt/lists/*
