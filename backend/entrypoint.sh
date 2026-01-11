#!/bin/sh

echo "Inicializando container PHP (DEV)"

mkdir -p storage/logs bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache 2>/dev/null || true
chmod -R 775 storage bootstrap/cache 2>/dev/null || true

echo "📦 Instalando dependências"
composer install

echo "✅ Container pronto. Subindo PHP-FPM"
exec "$@"
