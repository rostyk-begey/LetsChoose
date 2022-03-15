FROM node:lts-alpine

WORKDIR /app

COPY ./dist/apps/api .

ENV PORT=5000
EXPOSE ${PORT}

RUN yarn install --production

CMD node ./main.js
