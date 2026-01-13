# Projeto BRy Fullstack – Avaliação

## 📌 Contexto

Este projeto foi estruturado **para facilitar ao máximo a avaliação**.

Para isso, **algumas etapas que normalmente seriam manuais em um projeto real** já estão **automatizadas**:

* `.env` já incluído no repositório
* `php artisan migrate` executado automaticamente

⚠️ **Importante:**
Essas decisões **não representam boas práticas para produção real**, mas foram adotadas **intencionalmente** para reduzir fricção durante a avaliação.

---

## 🧱 Stack do Projeto

### Backend

* Laravel (PHP 8.2)
* Apache + PHP-FPM
* Upload e download de arquivos via `storage/public`

### Frontend

* Angular
* Build separado para DEV e PROD

### Banco de Dados

* MySQL 8
* Volume persistente

### Orquestração

* Docker + Docker Compose
* Perfis separados: `dev` e `prod`

---

## 🐳 Perfis Docker

| Profile | Descrição                                            |
| ------- | ---------------------------------------------------- |
| dev     | Ambiente de desenvolvimento com volumes (hot reload) |
| prod    | Ambiente de produção com imagens imutáveis           |

---

## ▶️ Como rodar o projeto

### 🔹 Ambiente DEV

Suba o ambiente de desenvolvimento:

```bash
docker compose --profile dev up -d --build
```

Aguarde os containers subirem completamente.

### 🔹 Ambiente PROD

Suba o ambiente de produção:

```bash
docker compose --profile prod up -d --build
```

Neste modo:

* Não há volumes de código
* As imagens já contêm o build final do frontend e backend
* O comportamento simula um ambiente produtivo real

---

## 🌐 Acessos e Links

### 🔗 Frontend

| Ambiente | URL                                            |
| -------- | ---------------------------------------------- |
| DEV      | [http://localhost:4200](http://localhost:4200) |
| PROD     | [http://localhost:4200](http://localhost:4200) |

> No perfil `prod`, o Angular já está **buildado** e servido via **NGINX**.

---

### 🔗 Backend (API Laravel)

| Ambiente | URL                                            |
| -------- | ---------------------------------------------- |
| DEV      | [http://localhost:8080](http://localhost:8080) |
| PROD     | [http://localhost:8080](http://localhost:8080) |

A API é servida via Apache.

---

### 🔗 Banco de Dados

| Item  | Valor     |
| ----- | --------- |
| Host  | localhost |
| Porta | 3307      |
| Banco | bry       |

As credenciais são carregadas automaticamente via **Docker Secrets**.
