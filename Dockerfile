FROM node:16

# Create app directory
WORKDIR /usr/src/app

COPY package*.json tsconfig.json ./
COPY tsconfig.json ./

RUN npm install
# RUN npm i -g ts-node

COPY src .

CMD [ "npm", "run", "serve" ]
