#!/bin/sh

echo "🚀 Inicializando container PHP (PROD)"

# Storage link
echo "🔗 Garantindo storage link"
php artisan storage:link || true

# Aguarda banco
echo "⏳ Aguardando banco de dados..."
sleep 5

# ⚠️ MIGRATE 
if [ "$RUN_MIGRATIONS" = "true" ]; then
  echo "🗄️ Rodando migrations (PROD)"
  php artisan migrate --force
else
  echo "ℹ️ Migrations desativadas (RUN_MIGRATIONS != true)"
fi

echo "✅ PHP-FPM iniciado"
exec "$@"
