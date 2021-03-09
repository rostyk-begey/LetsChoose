# Use a lighter version of Node as a parent image
FROM node:current AS build

RUN apt-get update && apt-get install -y \
    build-essential \
    libpng-dev

ENV NODE_ENV production
RUN npm i -g lerna
RUN npm i -g typescript
RUN npm i -g @nestjs/cli


WORKDIR /app

COPY ./package.json ./
COPY ./yarn.lock ./
COPY ./lerna.json ./

COPY ./packages/common/package.json ./packages/common/
COPY ./packages/client-next/package.json ./packages/client-next/
COPY ./packages/server/package.json ./packages/server/

RUN lerna bootstrap

COPY . .

RUN lerna run build

FROM node:current-alpine AS prod

ENV NODE_ENV production
RUN npm i -g lerna
RUN npm i -g typescript
RUN npm i -g @nestjs/cli

WORKDIR /app

COPY --from=build /app/package.json ./
COPY --from=build /app/yarn.lock ./
COPY --from=build /app/lerna.json ./
COPY --from=build /app/node_modules ./node_modules

COPY --from=build /app/packages/common/node_modules ./packages/common/node_modules
COPY --from=build /app/packages/common/dist ./packages/common/dist
COPY --from=build /app/packages/common/package.json ./packages/common/
COPY --from=build /app/packages/common/tsconfig.json ./packages/common/

COPY --from=build /app/packages/server/node_modules ./packages/server/node_modules
COPY --from=build /app/packages/server/dist ./packages/server/dist
COPY --from=build /app/packages/server/package.json ./packages/server/
COPY --from=build /app/packages/server/tsconfig.json ./packages/server/
COPY --from=build /app/packages/server/tsconfig.build.json ./packages/server/
COPY --from=build /app/packages/server/yarn.lock ./packages/server/

COPY --from=build /app/packages/client-next/.next ./packages/client-next/.next
COPY --from=build /app/packages/client-next/public ./packages/client-next/public
COPY --from=build /app/packages/client-next/node_modules ./packages/client-next/node_modules
COPY --from=build /app/packages/client-next/package.json ./packages/client-next/

EXPOSE 3000

CMD lerna run start --parallel --ignore=@lets-choose/client
