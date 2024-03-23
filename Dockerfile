FROM node:20-alpine AS BUILD

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

FROM node:20-alpine

WORKDIR /app

COPY --from=BUILD /app .

CMD npx prisma migrate deploy && npm run start:dev
