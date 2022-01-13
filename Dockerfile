FROM node:16 AS build
ARG CLIENT_ID
ARG CLIENT_SECRET
ENV VITE_APP_CLIENT_ID ${CLIENT_ID}
ENV VITE_APP_CLIENT_SECRET ${CLIENT_SECRET}
WORKDIR /app
COPY package.json yarn.lock /app/
RUN yarn
COPY . /app
RUN node node_modules/esbuild/install.js
RUN yarn build

FROM nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html