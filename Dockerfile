# syntax=docker/dockerfile:1

FROM node:22-slim


ENV NODE_ENV development

# Use root user until all dependencies are installed
WORKDIR /usr/src/app


# Now switch to node user AFTER everything is set up
USER node

EXPOSE 8000
CMD ["npm", "run", "dev"]
