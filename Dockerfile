FROM node:20-alpine AS BUILD

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

FROM node:20-alpine

WORKDIR /app

COPY --from=BUILD /app .

RUN npx prisma generate

CMD npx prisma migrate deploy && npm run start:dev
