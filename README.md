# 🏦 Bank System API

![Node.js](https://img.shields.io/badge/Node.js-Runtime-green)
![NestJS](https://img.shields.io/badge/NestJS-Framework-red)
![Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748)
![JWT](https://img.shields.io/badge/Auth-JWT-black)
![Swagger](https://img.shields.io/badge/Docs-Swagger-brightgreen)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

API bancária desenvolvida com **NestJS**, focada em autenticação segura
e operações financeiras como depósitos, retiradas e transferências.

------------------------------------------------------------------------

## 🚀 Visão Geral

A **Bank System API** fornece:

-   ✅ Autenticação segura com JWT\
-   ✅ Gerenciamento completo de usuários\
-   ✅ Operações bancárias seguras\
-   ✅ Estrutura preparada para aplicações financeiras escaláveis

Projeto desenvolvido seguindo boas práticas de arquitetura backend,
separação de responsabilidades e segurança.

------------------------------------------------------------------------

## 🧠 Stack Tecnológica

### Backend

-   Node.js
-   NestJS
-   TypeScript

### Banco de Dados

-   Prisma ORM

### Segurança

-   JWT (JSON Web Token)
-   Proteção de rotas com Guards

### Documentação

-   Swagger (OpenAPI)

------------------------------------------------------------------------

## ⚙️ Instalação

``` bash
git clone https://github.com/seu-usuario/bank-system-api.git
cd bank-system-api
npm install
```

Configure o arquivo `.env`:

``` env
DATABASE_URL=seu-url-do-banco-de-dados
JWT_SECRET=seu-segredo-jwt
```

Execute as migrations:

``` bash
npx prisma migrate deploy
```

Inicie a aplicação:

``` bash
npm run start
```

------------------------------------------------------------------------

## 🔐 Autenticação

### Login

``` http
POST /auth/login
```

``` json
{
  "cpf": "string",
  "password": "string"
}
```

Resposta:

``` json
{
  "access_token": "string"
}
```

Utilize o token no header:

    Authorization: Bearer <token>

------------------------------------------------------------------------

## 👤 Gerenciamento de Usuários

### Listar usuários

``` http
GET /users
```

### Criar usuário

``` http
POST /users
```

### Atualizar usuário

``` http
PATCH /users/{id}
```

### Deletar usuário

``` http
DELETE /users/{id}
```

Todos os endpoints requerem:

    Authorization: Bearer <token>

------------------------------------------------------------------------

## 💰 Operações Bancárias

### Listar transações

``` http
GET /transactions
```

### Depositar

``` http
POST /transactions/deposit
```

### Sacar

``` http
POST /transactions/withdraw
```

### Transferir

``` http
POST /transactions/transfer
```

### Consultar saldo

``` http
GET /transactions/balance
```

------------------------------------------------------------------------

## 🏗 Arquitetura

Estrutura baseada no padrão do NestJS:

-   Controllers → Entrada HTTP
-   Services → Regras de negócio
-   Guards → Proteção de rotas
-   Prisma → Persistência de dados

Projeto estruturado para manter:

-   🔒 Segurança
-   📈 Escalabilidade
-   🧠 Clareza arquitetural

------------------------------------------------------------------------

## 👨‍💻 Autor

Desenvolvido por **Afonso Gouveia**\
Engenheiro de Software focado em backend, APIs seguras e arquitetura
escalável.

------------------------------------------------------------------------

## 📄 Licença

Distribuído sob a licença MIT.
