FROM node:14.16.0

WORKDIR /app
COPY package.json .
RUN yarn install
COPY . .

CMD ["yarn", "dev"]