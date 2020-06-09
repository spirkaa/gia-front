FROM fholzer/nginx-brotli:latest

ENV TZ=Europe/Moscow

RUN set -eux \
    && ln -sf /usr/share/zoneinfo/${TZ} /etc/localtime

COPY ./compose/nginx/nginx.conf /etc/nginx/nginx.conf

COPY ./build /app
