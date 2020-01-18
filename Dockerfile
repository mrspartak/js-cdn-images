FROM node:12.14.1-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app && mkdir -p /home/node/app/upload && chown -R node:node /home/node/app/upload

WORKDIR /home/node/app

COPY package*.json ./

USER node

RUN npm install

COPY --chown=node:node . .

CMD [ "node", "index.js" ]