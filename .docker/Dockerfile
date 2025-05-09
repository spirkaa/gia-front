FROM peytonyip/nginx-brotli:1.27.4

ENV TZ=Europe/Moscow

RUN set -eux \
    && ln -sf /usr/share/zoneinfo/${TZ} /etc/localtime

WORKDIR /app

COPY ./.docker/nginx.conf /etc/nginx/nginx.conf
COPY ./build .
