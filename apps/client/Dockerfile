FROM node:lts-alpine

WORKDIR /app

COPY ./dist/apps/client ./

RUN yarn install

RUN yarn add -D typescript

CMD yarn next start -p $PORT
