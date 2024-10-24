FROM node:18-alpine AS builder
ENV NODE_ENV production

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .
RUN npm run build

FROM joseluisq/static-web-server:2 as production
ENV SERVER_ROOT=/app

COPY --from=builder /app/build /app

EXPOSE 80

