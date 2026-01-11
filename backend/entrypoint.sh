#!/bin/sh

echo "🚀 Inicializando container PHP (DEV)..."

# Garante pastas do Laravel
mkdir -p storage/logs bootstrap/cache

# Ajusta permissões (ignora erro em volume/Windows)
chown -R www-data:www-data storage bootstrap/cache 2>/dev/null || true
chmod -R 775 storage bootstrap/cache 2>/dev/null || true

# Instala dependências se ainda não existirem
if [ ! -f vendor/autoload.php ]; then
    echo "📦 vendor não encontrado. Rodando composer install..."
    composer install
else
    echo "📦 vendor já existe. Pulando composer install."
fi

# Limpa caches do Laravel (seguro rodar sempre)
php artisan optimize:clear 2>/dev/null || true

echo "✅ Container pronto. Subindo PHP-FPM..."

exec "$@"
