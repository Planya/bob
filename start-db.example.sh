#!/bin/bash
set -e

DOCKER_NAME="";
USER="";
PASSWORD="";
DATABASE="";
PORT=5433;

echo "Запускаем [$DOCKER_NAME] или удаляем и запускаем | --restart=always"
(docker kill $DOCKER_NAME || :) && \
  (docker rm $DOCKER_NAME || :) && \
  docker run --restart=always --name $DOCKER_NAME -e POSTGRES_PASSWORD=$PASSWORD \
  -e PGPASSWORD=$PASSWORD \
  -p $PORT:5432 \
  -d $USER

echo "Ждем когда запустится pg-server [$DOCKER_NAME]";
sleep 3;

echo "CREATE DATABASE $DATABASE ENCODING 'UTF-8';" | docker exec -i $DOCKER_NAME psql -U postgres
echo "\l" | docker exec -i $DOCKER_NAME psql -U postgres