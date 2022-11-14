
FROM node:14.18-alpine

WORKDIR /app

COPY package*.json ./

# RUN npm install
RUN npm ci

# TODO: ? store less files inside the image
COPY . .


# runs during the docker build process

RUN rm -rf node_modules/.cache
RUN rm -rf dist

RUN npm run build

# default command when running up a container (overriden in docker-compose)
# CMD npm run build