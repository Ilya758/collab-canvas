FROM node:22-alpine

WORKDIR /app/services/auth-service

COPY services/auth-service/package.json services/auth-service/yarn.lock ./

RUN yarn install --frozen-lockfile

COPY services/auth-service/prisma ./prisma

RUN npx prisma generate

COPY services/auth-service/. .

EXPOSE 3001
