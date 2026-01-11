FROM php:8.2-fpm

WORKDIR /var/www/html

# ----------------------------
# Dependências do sistema
# ----------------------------
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    libpng-dev \
    libonig-dev \
 && docker-php-ext-install \
    pdo \
    pdo_mysql \
    zip \
    mbstring

# ----------------------------
# Composer
# ----------------------------
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# ----------------------------
# EntryPoint
# ----------------------------
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

# ----------------------------
# PHP-FPM
# ----------------------------
CMD ["php-fpm"]
