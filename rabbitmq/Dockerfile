FROM node:22-slim
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --quiet
RUN apt-get update && apt-get install -y procps
COPY . .
CMD ["npm", "run", "dev"]
