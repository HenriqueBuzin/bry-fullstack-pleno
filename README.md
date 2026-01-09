# Projeto Empresas – Estrutura Base

Arquitetura base com Docker utilizando:

- Apache HTTP Server (conforme edital)
- PHP-FPM via FastCGI
- MySQL
- Frontend separado (Angular-ready)
- Docker Secrets (Swarm-ready)

## Subir ambiente
```bash
docker swarm init
docker stack deploy -c docker-compose.yml empresas
