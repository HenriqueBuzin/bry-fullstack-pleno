# README – Projeto Bry Fullstack (Avaliação)

## 📌 Contexto Geral

Este projeto foi estruturado **pensando em facilitar ao máximo a vida do avaliador**. Por esse motivo, **arquivos sensíveis que normalmente não iriam para o Git (como `.env` e secrets de banco)** **foram incluídos propositalmente no repositório** apenas para fins de avaliação.

👉 **Importante:** essa decisão **não representa uma boa prática para produção real**, mas foi adotada aqui para que o projeto possa ser executado sem configurações extras.

---

## 🧱 Arquitetura Resumida

O sistema é composto por:

* **Backend**

  * Laravel (PHP)
  * Apache como servidor web
* **Frontend**

  * Aplicação Node (Angular)
* **Banco de Dados**

  * MySQL 8
* **Orquestração**

  * Docker + Docker Compose
  * Perfis separados para **dev** e **prod**

Toda a comunicação ocorre dentro da rede Docker `app-network`.

---

## 🐳 Perfis Docker

Utilizamos **profiles** no Docker Compose para separar os ambientes:

* `dev` → ambiente de desenvolvimento
* `prod` → ambiente de produção

Isso permite subir apenas os containers necessários para cada cenário.

---

## ▶️ Como rodar o projeto

### 🔹 Ambiente de Desenvolvimento (DEV)

No modo **DEV**, os containers utilizam **volumes** para refletir alterações em tempo real no código.

#### 1️⃣ Subir os containers

```bash
docker compose --profile dev up -d --build
```

#### 2️⃣ Acessar o container do backend

```bash
docker compose exec backend-php bash
```

#### 3️⃣ Rodar as migrations

```bash
php artisan migrate
```

Esse comando irá:

* Criar as tabelas principais
* Criar tabelas de relacionamento
* Criar tabelas de autenticação e tokens

#### 4️⃣ Criar o link de storage

```bash
php artisan storage:link
```

Isso é necessário para que arquivos públicos funcionem corretamente no Laravel.

#### 5️⃣ Acessos

* Frontend: [http://localhost:4200](http://localhost:4200)
* Backend (API): [http://localhost:8080](http://localhost:8080)
* Banco de dados: porta **3307** (MySQL)

---

### 🔹 Ambiente de Produção (PROD)

No modo **PROD**, o foco é simular um ambiente mais próximo do real:

* Volumes do backend em modo **read-only**
* Build otimizado do frontend

#### 1️⃣ Subir os containers

```bash
docker compose --profile prod up -d --build
```

#### 2️⃣ Rodar migrations (primeira execução)

```bash
docker compose exec backend-php-prod bash
php artisan migrate
php artisan storage:link
```

#### 3️⃣ Acessos

* Frontend: [http://localhost:4200](http://localhost:4200)
* Backend (API): [http://localhost:8080](http://localhost:8080)

---

## 🗄️ Banco de Dados

* MySQL 8
* Volume persistente: `dbdata`
* Credenciais fornecidas via **Docker secrets** (já incluídas no repositório para facilitar a avaliação)

Não é necessário configurar nada manualmente.

---

## 📝 Observações Importantes

* ⚠️ O projeto **já está preparado para rodar**, sem necessidade de criar `.env` ou secrets
* ⚠️ O uso de secrets no Git foi **intencional e exclusivo para avaliação**
* ⚠️ Em um cenário real, esses arquivos **nunca deveriam ser versionados**

---

## ✅ Resumo Rápido

```bash
# DEV
docker compose --profile dev up -d --build
docker compose exec backend-php bash
php artisan migrate
php artisan storage:link

# PROD
docker compose --profile prod up -d --build
docker compose exec backend-php-prod bash
php artisan migrate
php artisan storage:link
```

---

Qualquer dúvida durante a avaliação, o projeto foi pensado para ser **executado com o mínimo de fricção possível** 🚀
