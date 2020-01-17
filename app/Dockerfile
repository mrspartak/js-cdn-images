FROM node:10-alpine

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global

ENV PATH=$PATH:/home/node/.npm-global/bin 

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

USER node

RUN npm install

RUN npm install pm2 -g

COPY --chown=node:node . .

EXPOSE 3000

ARG APP_INSTANCES

RUN echo "APP_INSTANCES $APP_INSTANCES"

CMD [ "node", "index.js" ]