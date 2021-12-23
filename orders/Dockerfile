FROM node:14.16.0


WORKDIR /app

COPY package.json  .
RUN yarn install --production

COPY . .

CMD ["yarn", "start"]
