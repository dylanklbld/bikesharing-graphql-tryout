#!/bin/bash

docker run -d -v /data/db:/data/db \
    --name mongo-docker-bikes \
    -p 27888:27017 \
    -e MONGO_INITDB_ROOT_USERNAME=mongo_admin \
    -e MONGO_INITDB_ROOT_PASSWORD=mongo_pwd