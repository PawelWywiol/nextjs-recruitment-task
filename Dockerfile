ARG NODE_VERSION=22.14.0-alpine
FROM node:${NODE_VERSION} AS base
WORKDIR /app
COPY package.json package-lock.json ./
ENV NODE_ENV=production
RUN npm ci --omit=dev && npm cache clean --force

FROM base AS builder
COPY . .
RUN npm run generate-types
RUN npm run build

FROM node:${NODE_VERSION} AS runner
USER node
ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLE=1
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.ts ./next.config.ts
EXPOSE 3000
CMD ["npm", "start"]