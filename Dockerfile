FROM node:25-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm i

FROM alpine:3.19
COPY --from=builder /app/node_modules .
ENTRYPOINT [ "npm start" ]