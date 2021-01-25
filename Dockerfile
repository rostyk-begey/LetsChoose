# Use a lighter version of Node as a parent image
FROM node:current AS build

WORKDIR /app

COPY ./package.json ./
COPY ./yarn.lock ./
COPY ./lerna.json ./
COPY ./tsconfig.json ./
COPY ./tsconfig.packages.json ./

COPY ./packages/common/package.json ./packages/common/
COPY ./packages/common/tsconfig.json ./packages/common/

COPY ./packages/client-next/package.json ./packages/client-next/
COPY ./packages/client-next/tsconfig.json ./packages/client-next/

COPY ./packages/server/package.json ./packages/server/
COPY ./packages/server/tsconfig.json ./packages/server/
COPY ./packages/server/tsconfig.build.json ./packages/server/

RUN yarn install --production=false

COPY ./packages/ ./packages/

RUN yarn lerna bootstrap
RUN yarn lerna run build

EXPOSE 3000

CMD yarn lerna run start --ignore @lets-choose/client --parallel
