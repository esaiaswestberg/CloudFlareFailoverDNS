FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV app_mode=MAIN
ENV api_key=
ENV zone_id=
ENV record_id=
ENV service_host=
ENV service_contains=

CMD [ "npm", "start" ]