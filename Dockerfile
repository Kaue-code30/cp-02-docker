FROM node:20.16.0-alpine3.20 AS deps
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

FROM node:20.16.0-alpine3.20 AS runtime
WORKDIR /app

ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY src ./src

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 3000
CMD ["node", "src/index.js"]
