FROM node:18 AS BUILD

WORKDIR /app

RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

COPY pnpm-lock.yaml package.json ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build::ts

FROM node:18 as RUNNER

WORKDIR /app

RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

COPY pnpm-lock.yaml package.json tsconfig.json ./

RUN pnpm install --frozen-lockfile --prod

COPY --from=BUILD /app/dist/ /app/dist/

EXPOSE 5000

CMD ["node", "-r", "tsconfig-paths/register", "dist/source/start.js"]