FROM node:dubnium-alpine

WORKDIR /app

COPY ./package.json .
COPY ./package-lock.json .

RUN apk add make g++ python # bcrypt build dependencies
RUN npm install

COPY . .

EXPOSE 3000

#TODO to avoid problems, a database snapshot with mock data should be imported here

CMD npm start
