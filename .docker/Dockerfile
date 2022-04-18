FROM peytonyip/nginx-brotli:lite

ENV TZ=Europe/Moscow

RUN set -eux \
    && ln -sf /usr/share/zoneinfo/${TZ} /etc/localtime

WORKDIR /app

ADD ./.docker/nginx.conf /etc/nginx/nginx.conf
ADD ./build .
