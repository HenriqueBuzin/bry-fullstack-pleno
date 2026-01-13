#!/bin/sh

set -e

echo "🚀 Inicializando container PHP (PROD)"

# Garante que estamos no diretório certo
cd /var/www/html

# ⏳ Aguarda banco
echo "⏳ Aguardando banco de dados..."
sleep 5

# 🗄️ Migrations (controladas por flag)
if [ "$RUN_MIGRATIONS" = "true" ]; then
  echo "🗄️ Rodando migrations (PROD)"
  php artisan migrate --force
else
  echo "ℹ️ Migrations desativadas (RUN_MIGRATIONS != true)"
fi

echo "✅ PHP-FPM iniciado"
exec "$@"
