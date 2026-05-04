FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package*.json ./

RUN if [ -f pnpm-lock.yaml ]; then \
        pnpm install --frozen-lockfile; \
    else \
        pnpm install; \
    fi

COPY . .

EXPOSE 3000

CMD ["pnpm", "dev"]