# Use a lighter version of Node as a parent image
#FROM node:current AS build

#RUN apt-get update && apt-get install -y \
#    build-essential \
#    libpng-dev

#ENV NODE_ENV production
#RUN npm i -g nx
#RUN npm i -g typescript

#WORKDIR /app

#COPY ./package.json ./
#COPY ./yarn.lock ./
#COPY ./nx.json ./
#COPY ./workspace.json ./

#RUN yarn install --production
#RUN yarn add -D @nrwl/cli @nrwl/workspace @nrwl/next typescript --silent

#COPY . .

#RUN yarn run build

FROM node:lts-alpine AS prod

ENV NODE_ENV production

WORKDIR /app

#COPY --from=build /app/dist/apps ./
COPY ./dist/apps ./

WORKDIR /app/api
RUN npm install --production
# dependencies that nestjs needs
#RUN npm install tslib

WORKDIR /app/client
RUN npm install --production

CMD node /app/api/main.js \
    && cd /app/client \
    && npm run start

#CMD nx run-many --target serve --all --parallel --production
