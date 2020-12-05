# Use a lighter version of Node as a parent image
FROM node:current-alpine

WORKDIR /app

COPY ./package.json ./
COPY ./yarn.lock ./

RUN yarn install

COPY ./client/package.json ./client/
COPY ./client/yarn.lock ./client/

COPY ./server/package.json ./server/
COPY ./server/yarn.lock ./server/

RUN yarn run client:install

COPY ./client/ ./client/

RUN yarn run client:build

RUN yarn run server:install

COPY ./ ./

RUN yarn run build-ts

CMD ["yarn", "start"]
