FROM mongo:latest

COPY mongod.conf /etc/mongod.conf

COPY mongo_dump /docker-entrypoint-initdb.d/mongo_dump
COPY init-mongo.sh /docker-entrypoint-initdb.d/init-mongo.sh

RUN chmod +x /docker-entrypoint-initdb.d/init-mongo.sh
