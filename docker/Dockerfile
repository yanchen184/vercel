FROM nginx:1.19

LABEL maintainer="YC1" \
  org.label-schema.name="web" \
  org.label-schema.vendor="YC1" \
  org.label-schema.schema-version="1.0"

EXPOSE 80

COPY ./config/nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY build /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]