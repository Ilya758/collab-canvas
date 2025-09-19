FROM node:22-alpine

WORKDIR /app/services/realtime-service

COPY services/realtime-service/package.json services/realtime-service/yarn.lock ./

RUN yarn install --frozen-lockfile

COPY services/realtime-service/. .

EXPOSE 3003
