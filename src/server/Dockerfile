FROM node:19

WORKDIR /usr/src/app

COPY .prod.package.json ./package.json
COPY .prod.package-lock.json ./package-lock.json

RUN npm install

COPY . .

COPY ../../.env ./

EXPOSE 3001

ENV NODE_ENV production
CMD [ "npm", "run", "dev:server" ]
