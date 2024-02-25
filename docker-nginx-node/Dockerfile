FROM node:lts-alpine as build-stage

WORKDIR /app

COPY app /app

RUN npm install

CMD node index.js