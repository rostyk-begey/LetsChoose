FROM node:lts-alpine

#WORKDIR /app
#
#COPY ./dist/apps/client .
#
#ENV PORT=80
#EXPOSE ${80}
#
#RUN npm install
#
#CMD npm run start

WORKDIR /app

COPY ./dist/apps/client ./

RUN yarn install

RUN yarn add axios
RUN yarn add -D typescript

CMD yarn next start -p $PORT
