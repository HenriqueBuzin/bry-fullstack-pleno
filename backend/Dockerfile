FROM php:8.2-fpm

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
# Permissões
# ----------------------------
RUN chown -R www-data:www-data /var/www/html

# ----------------------------
# PHP-FPM
# ----------------------------
CMD ["php-fpm"]
