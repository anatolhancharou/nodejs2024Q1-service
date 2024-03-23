FROM node:20-alpine AS BUILD

WORKDIR /app

COPY package*.json ./

RUN npm install && npm cache clean --force

COPY . .

FROM node:20-alpine

WORKDIR /app

COPY --from=BUILD /app .

CMD ["npm", "run", "start:dev"]
