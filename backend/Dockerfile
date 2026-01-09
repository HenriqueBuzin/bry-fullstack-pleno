FROM php:8.2-fpm

# ----------------------------
# Diretório de trabalho
# ----------------------------
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

COPY composer.json composer.lock ./

RUN composer install --no-dev --optimize-autoloader --no-scripts

# ----------------------------
# PHP-FPM
# ---------------------------- 
CMD ["php-fpm"]
