FROM node:22 AS build

ARG API_URL
ARG CLIENT_ID
ARG CLIENT_SECRET

ENV VITE_APP_API=${API_URL}
ENV VITE_APP_CLIENT_ID=${CLIENT_ID}
ENV VITE_APP_CLIENT_SECRET=${CLIENT_SECRET}

WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN npm install -g corepack@latest
RUN corepack enable

COPY package.json pnpm-lock.yaml /app/
RUN pnpm install --ignore-scripts

COPY . /app
RUN pnpm build

FROM nginx

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html