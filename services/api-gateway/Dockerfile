FROM node:22-alpine

WORKDIR /app/services/api-gateway

COPY services/api-gateway/package.json services/api-gateway/yarn.lock ./

RUN yarn install --frozen-lockfile

COPY services/api-gateway/. .

EXPOSE 3000

CMD ["yarn", "start:dev"]