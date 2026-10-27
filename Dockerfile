# Single-image deploy: builds the React client, served by the Express API.
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY client/package.json client/
COPY server/package.json server/
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/package*.json ./
COPY --from=build /app/server ./server
COPY --from=build /app/client/dist ./client/dist
RUN npm install --omit=dev --workspace server
EXPOSE 5050
HEALTHCHECK --interval=30s --timeout=4s CMD wget -qO- http://127.0.0.1:5050/api/health || exit 1
CMD ["node", "server/src/index.js"]
