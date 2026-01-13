#!/bin/sh

echo "🚀 Inicializando container PHP (DEV)"

# Garantir pastas básicas
mkdir -p storage/logs bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache || true
chmod -R 775 storage bootstrap/cache || true

echo "📦 Instalando dependências (composer)"
composer install --no-interaction

# Aguarda banco
echo "⏳ Aguardando banco de dados..."
sleep 5

# Garante APP_KEY
if [ -z "$APP_KEY" ] || [ "$APP_KEY" = "" ]; then
  echo "🔑 Gerando APP_KEY"
  php artisan key:generate
fi

# Storage link
echo "🔗 Criando storage link"
php artisan storage:link || true

# Migrations
echo "🗄️ Rodando migrations"
php artisan migrate --force

echo "✅ Container pronto. Subindo PHP-FPM"
exec "$@"
