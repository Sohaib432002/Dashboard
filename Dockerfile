# ---- build the React frontend ----
FROM node:24-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY public ./public
COPY src ./src
COPY tailwind.config.js postcss.config.js ./
RUN npm run build

# ---- runtime: API + built frontend ----
FROM node:24-slim
WORKDIR /app
ENV NODE_ENV=production PORT=8080 DB_PATH=/data/gallstone.db
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts --no-audit --no-fund
COPY server ./server
COPY --from=build /app/build ./build
EXPOSE 8080
CMD ["node", "server/index.js"]
