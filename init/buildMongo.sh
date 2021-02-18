#!/bin/sh
docker exec mongo-on-docker mongo rent-bikes  -u mongoadmin -p secret --authenticationDatabase admin --eval '!db.runCommand({ usersInfo: { user: "mongoadmin", db: "rent-bikes" } }).users.length == 1 && db.createUser({ user: "mongoadmin", pwd: "secret", roles: [{ role: "readWrite", db: "rent-bikes" }]})' 
