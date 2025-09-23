FROM node:22-slim

ENV NODE_ENV=development
WORKDIR /usr/src/app

# Instala OpenSSL
RUN apt-get update -y && apt-get install -y openssl libssl-dev procps \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci --quiet

COPY ./prisma prisma
COPY . .

USER node
EXPOSE 8000
CMD ["npm", "run", "dev"]
