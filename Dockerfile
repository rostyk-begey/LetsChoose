# Use a lighter version of Node as a parent image
FROM node:current-alpine

WORKDIR /app

COPY ./ ./

RUN yarn install

RUN yarn run client:install

RUN yarn run client:build

RUN yarn run server:install

RUN yarn run build-ts

CMD ["yarn", "start"]
