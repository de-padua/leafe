# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.14.0
FROM node:${NODE_VERSION}-alpine

ENV NODE_ENV development

# Use root user until all dependencies are installed
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --quiet

COPY ./prisma prisma
COPY . .

# Now switch to node user AFTER everything is set up
USER node

EXPOSE 8000
CMD ["npm", "run", "dev"]
