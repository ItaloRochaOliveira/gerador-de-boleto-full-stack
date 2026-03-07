# Etapa 1: criar pasta e colocar arquivo de dependencia nele, também baixar elas e buildar.
FROM node:22-alpine3.18 AS build

WORKDIR /app

COPY backend/package.json backend/pnpm-lock.yaml backend/tsconfig.json ./
RUN npm install -g pnpm
RUN pnpm install

COPY backend/src ./src

RUN pnpm run build

# Etapa 2: baixar dependenc. de prod. e rodar app.
FROM node:22-alpine3.18

WORKDIR /app

COPY backend/package.json backend/pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install --prod

COPY --from=build /app/build ./build

EXPOSE 3006

CMD ["pnpm", "start"]