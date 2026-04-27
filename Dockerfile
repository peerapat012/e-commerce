FROM node:24-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install -g nodemon ts-node

COPY . .

CMD ["nodemon", "src/server.ts"]