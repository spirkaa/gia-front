FROM fholzer/nginx-brotli:mainline-latest

RUN apk add --no-cache tzdata \
    && ln -sf /usr/share/zoneinfo/Europe/Moscow /etc/localtime

ADD ./compose/nginx/nginx.conf /etc/nginx/nginx.conf

COPY ./build /app