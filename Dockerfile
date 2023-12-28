FROM node:18-alpine

WORKDIR /app

COPY . .

RUN npm config set registry https://registry.npm.taobao.org

RUN npm install -g pnpm

RUN pnpm install && \
    npm run build && \
    rm -rf node_modules

FROM nginx

WORKDIR /build

COPY --from=0 /app/dist /build

COPY --from=0 /app/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
