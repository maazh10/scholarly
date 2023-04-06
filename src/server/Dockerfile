FROM node:19

WORKDIR /usr/src/app

COPY .prod.package.json ./package.json
COPY .prod.package-lock.json ./package-lock.json

RUN npm install

COPY . .

COPY ../../.env ./

EXPOSE 3001

CMD [ "npm", "run", "start:server" ]
