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
ENV local_service_port=
ENV cloudflare_service_port=443
ENV service_contains=

CMD [ "npm", "start" ]