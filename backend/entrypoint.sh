#!/bin/sh

set -e

echo "🚀 Inicializando container PHP (DEV)"

cd /var/www/html

# 📁 Garantir pastas básicas
mkdir -p storage/logs bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache || true
chmod -R 775 storage bootstrap/cache || true

# 📦 Dependências
echo "📦 Instalando dependências (composer)"
composer install --no-interaction

# ⏳ Aguarda banco
echo "⏳ Aguardando banco de dados..."
sleep 10

# 🔑 Garante APP_KEY
if [ -z "$APP_KEY" ]; then
  echo "🔑 Gerando APP_KEY"
  php artisan key:generate
else
  echo "✅ APP_KEY já definido"
fi

# 🗄️ Migrations
echo "🗄️ Rodando migrations"
php artisan migrate --force

echo "✅ Container pronto. Subindo PHP-FPM"
exec "$@"
