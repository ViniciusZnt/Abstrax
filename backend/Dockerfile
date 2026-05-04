FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package.json ./

RUN pnpm install

COPY . .

RUN pnpm prisma generate

EXPOSE 4000

CMD ["sh", "-c", "pnpm prisma migrate deploy && pnpm dev"]
