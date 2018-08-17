FROM composer:1.7 as builder
COPY api /code/api
WORKDIR /code/api
RUN composer install

FROM php:7-fpm
COPY php.ini /usr/local/etc/php/
COPY --from=builder /code/api /code/api
WORKDIR /code/api
RUN docker-php-ext-install pdo_mysql
RUN chown -R www-data:www-data storage \
  && ln -s storage/app/public public/storage \
  && cp .env.example .env \
  && php artisan key:generate

