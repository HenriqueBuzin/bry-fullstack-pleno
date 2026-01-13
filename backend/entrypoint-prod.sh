#!/bin/sh

set -e

echo "🚀 Inicializando container PHP (PROD)"

# Garante que estamos no diretório certo
cd /var/www/html

# ⏳ Aguarda banco
echo "⏳ Aguardando banco de dados..."
sleep 5

# 🗄️ Migrations (controladas por flag)
echo "🗄️ Rodando migrations (PROD)"
php artisan migrate --force

echo "✅ PHP-FPM iniciado"
exec "$@"
