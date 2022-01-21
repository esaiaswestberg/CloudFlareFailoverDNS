FROM node:17-alpine

WORKDIR /app

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN npm --global install pnpm

RUN pnpm install

COPY ./dist ./dist

CMD [ "npm", "start" ]