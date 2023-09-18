FROM node:20-alpine as dev

WORKDIR /usr/src/app

COPY package*.json tsconfig.json ./
COPY tsconfig.json ./
COPY .env ./

RUN npm install

COPY src .

CMD [ "npm", "run", "serve" ]

FROM node:20-alpine as production

WORKDIR /usr/src/app

COPY package*.json tsconfig.json ./
COPY tsconfig.json ./
COPY .env ./

RUN npm install

COPY src .

RUN npm build

CMD [ "npm", "run", "serve" ]
