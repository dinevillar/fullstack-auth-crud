FROM node:20-alpine as base

WORKDIR /app

COPY package*.json ./
RUN npm install

FROM base as development
EXPOSE 3000
CMD ["npm", "run", "dev"]

FROM base as build
COPY . .
RUN npm run build

FROM build as preview
CMD ["npm", "run", "preview"]
