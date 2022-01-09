FROM node:16 AS build
WORKDIR /app
COPY package.json yarn.lock /app/
RUN yarn
COPY . /app
RUN node node_modules/esbuild/install.js
RUN yarn build

FROM nginx
COPY --from=build /app/dist /usr/share/nginx/html