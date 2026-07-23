FROM node:18-alpine

WORKDIR /app

COPY server/package.json server/
RUN cd server && npm install --production

COPY server/ server/
COPY client/ client/

WORKDIR /app/client
RUN npm install && npm run build

WORKDIR /app/server

EXPOSE 5000

ENV NODE_ENV=production

CMD ["node", "server.js"]
