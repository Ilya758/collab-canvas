FROM node:22-alpine

WORKDIR /app/services/workspace-service

COPY services/workspace-service/package.json services/workspace-service/yarn.lock ./

RUN yarn install --frozen-lockfile

COPY services/workspace-service/prisma ./prisma

RUN npx prisma generate

COPY services/workspace-service/. .

EXPOSE 3002