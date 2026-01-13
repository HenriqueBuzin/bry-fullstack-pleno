#!/bin/sh

set -e

echo "🚀 Inicializando container PHP (PROD)"

# Garante diretório
cd /var/www/html

# ⏳ Aguarda banco
echo "⏳ Aguardando banco de dados..."
sleep 30

# 🗄️ Migrations
echo "🗄️ Rodando migrations (PROD)"
php artisan migrate --force

echo "✅ PHP-FPM iniciado"
exec "$@"
