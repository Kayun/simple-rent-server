#!/usr/bin/env bash

INSTANCE=$1
HTTP_PORT=$2
HTTPS_PORT=$3
if [ -z "$INSTANCE" ] || [ -z "$HTTP_PORT" ] ; then
    echo "Usage: $ ./run-service.sh <instance> <port>"
    exit 1
fi

if [ -z "$HTTPS_PORT" ] ; then
    HTTPS_PORT=443
fi
SERVICE="backend"

cd ./docker

HTTP_PORT="$HTTP_PORT" HTTPS_PORT="$HTTPS_PORT" APP_NAME="$INSTANCE.$SERVICE" \
docker-compose -f ./docker-compose.prod.yml up -d
