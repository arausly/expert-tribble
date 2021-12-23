FROM node:12.22.1


WORKDIR /app

COPY package.json  .
RUN yarn install --production

COPY . .

CMD ["yarn", "start"]
