FROM node:18-alpine
ENV NODE_ENV production

WORKDIR /app


COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .

EXPOSE 3000
CMD [ "node", "server.js"]
