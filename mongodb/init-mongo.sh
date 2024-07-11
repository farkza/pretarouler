#!/bin/bash
echo "Restoring MongoDB databases..."

mongorestore --host localhost --port 27017 --db pretarouler /docker-entrypoint-initdb.d/mongo_dump/cars.bson
mongorestore --host localhost --port 27017 --db pretarouler /docker-entrypoint-initdb.d/mongo_dump/users.bson
mongorestore --host localhost --port 27017 --db pretarouler /docker-entrypoint-initdb.d/mongo_dump/reservations.bson

echo "MongoDB databases restored."
