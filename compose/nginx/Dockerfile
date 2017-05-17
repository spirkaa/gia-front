FROM nginx:alpine
ADD ./compose/nginx/nginx.conf /etc/nginx/nginx.conf

COPY ./dist /dist

RUN apk add --no-cache tzdata \
    && ln -sf /usr/share/zoneinfo/Europe/Moscow /etc/localtime
