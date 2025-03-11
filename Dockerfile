FROM node:20-slim

WORKDIR /app

COPY package*.json /app/

RUN npm install

COPY . /app/

RUN npm run build

CMD [ "npm","run","dev" ]
