#!/bin/bash
docker-compose -f docker/docker-compose.yaml --env-file=docker/.env build
docker-compose -f docker/docker-compose.yaml --env-file=docker/.env up -d
docker-compose -f docker/docker-compose.yaml --env-file=docker/.env logs -f