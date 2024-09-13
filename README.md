# Bank System API

Bem-vindo à API do Sistema Bancário! Este projeto fornece endpoints para gerenciar usuários e realizar operações bancárias, como depósitos, retiradas e transferências.

## Sumário

- [Visão Geral](#visão-geral)
- [Tecnologias](#tecnologias)
- [Instalação](#instalação)
- [Uso](#uso)
  - [Autenticação](#autenticação)
  - [Gerenciamento de Usuários](#gerenciamento-de-usuários)
  - [Operações Bancárias](#operações-bancárias)
- [Documentação da API](#documentação-da-api)
- [Licença](#licença)

## Visão Geral

A Bank System API permite:

- Gerenciar usuários (criar, listar, atualizar e deletar).
- Realizar operações bancárias, como depósitos, retiradas, transferências e consulta de saldo.

## Tecnologias

Este projeto utiliza as seguintes tecnologias:

- **Node.js** - Ambiente de execução para JavaScript.
- **NestJS** - Framework para construir aplicações server-side.
- **Prisma** - ORM para interagir com o banco de dados.
- **Swagger** - Documentação interativa da API.

## Instalação

Para instalar e rodar este projeto localmente, siga os passos abaixo:

1. Clone o repositório:

    ```bash
    git clone https://github.com/seu-usuario/bank-system-api.git
    cd bank-system-api
    ```

2. Instale as dependências:

    ```bash
    npm install
    ```

3. Configure o banco de dados. Crie um arquivo `.env` na raiz do projeto e adicione suas variáveis de ambiente:

    ```env
    DATABASE_URL=seu-url-do-banco-de-dados
    JWT_SECRET=seu-segredo-jwt
    ```

4. Execute as migrações do Prisma:

    ```bash
    npx prisma migrate deploy
    ```

5. Inicie a aplicação:

    ```bash
    npm run start
    ```

## Uso

### Autenticação

Para autenticar, você deve fazer login utilizando CPF e senha para obter um token JWT.

**Endpoint para login:**

```http
POST /auth/login
```

**Corpo da Requisição:**

```json
{
  "cpf": "string",
  "password": "string"
}
```

**Respostas:**

- **200 OK**
  ```json
  {
    "access_token": "string"
  }
  ```
- **401 Unauthorized**

Utilize o token JWT retornado para acessar endpoints protegidos, incluindo-o no cabeçalho `Authorization` no formato `Bearer <token>`.

### Gerenciamento de Usuários

#### Retorna todos os usuários

```http
GET /users
```

| Parâmetro       | Tipo       | Descrição                                  |
|-----------------|------------|--------------------------------------------|
| `Authorization` | `string`   | **Obrigatório**. Token JWT no formato `Bearer <token>` |

**Respostas:**

- **200 OK**
  ```json
  [
    {
      "id": "string",
      "name": "string",
      "cpf": "string",
      "phoneNumber": "string",
      "dateOfBirth": "string",
      "accountType": "string"
    }
  ]
  ```
- **500 Internal Server Error**

#### Cria um novo usuário

```http
POST /users
```

| Parâmetro       | Tipo       | Descrição                                  |
|-----------------|------------|--------------------------------------------|
| `Authorization` | `string`   | **Obrigatório**. Token JWT no formato `Bearer <token>` |

**Corpo da Requisição:**

```json
{
  "name": "string",
  "cpf": "string",
  "password": "string",
  "phoneNumber": "string",
  "dateOfBirth": "string",
  "accountType": "string"
}
```

**Respostas:**

- **201 Created**
- **400 Bad Request**

#### Atualiza um usuário existente

```http
PATCH /users/{id}
```

| Parâmetro       | Tipo       | Descrição                                  |
|-----------------|------------|--------------------------------------------|
| `id`            | `string`   | **Obrigatório**. O ID do usuário a ser atualizado |
| `Authorization` | `string`   | **Obrigatório**. Token JWT no formato `Bearer <token>` |

**Corpo da Requisição:**

```json
{
  "phoneNumber": "string",
  "oldPassword": "string",
  "newPassword": "string"
}
```

**Respostas:**

- **200 OK**
- **400 Bad Request**
- **404 Not Found**

#### Exclui um usuário

```http
DELETE /users/{id}
```

| Parâmetro       | Tipo       | Descrição                                  |
|-----------------|------------|--------------------------------------------|
| `id`            | `string`   | **Obrigatório**. O ID do usuário a ser deletado |
| `Authorization` | `string`   | **Obrigatório**. Token JWT no formato `Bearer <token>` |

**Respostas:**

- **200 OK**
- **404 Not Found**

### Operações Bancárias

#### Retorna todas as contas

```http
GET /transactions
```

| Parâmetro       | Tipo       | Descrição                                  |
|-----------------|------------|--------------------------------------------|
| `Authorization` | `string`   | **Obrigatório**. Token JWT no formato `Bearer <token>` |

**Respostas:**

- **200 OK**
- **500 Internal Server Error**

#### Deposita fundos em uma conta

```http
POST /transactions/deposit
```

| Parâmetro       | Tipo       | Descrição                                  |
|-----------------|------------|--------------------------------------------|
| `Authorization` | `string`   | **Obrigatório**. Token JWT no formato `Bearer <token>` |

**Corpo da Requisição:**

```json
{
  "accountNumber": "string",
  "balance": 0,
  "password": "string"
}
```

**Respostas:**

- **200 OK**
- **400 Bad Request**
- **404 Not Found**

#### Retira fundos de uma conta

```http
POST /transactions/withdraw
```

| Parâmetro       | Tipo       | Descrição                                  |
|-----------------|------------|--------------------------------------------|
| `Authorization` | `string`   | **Obrigatório**. Token JWT no formato `Bearer <token>` |

**Corpo da Requisição:**

```json
{
  "accountNumber": "string",
  "balance": 0,
  "password": "string"
}
```

**Respostas:**

- **200 OK**
- **400 Bad Request**
- **404 Not Found**

#### Transfere fundos entre contas

```http
POST /transactions/transfer
```

| Parâmetro       | Tipo       | Descrição                                  |
|-----------------|------------|--------------------------------------------|
| `Authorization` | `string`   | **Obrigatório**. Token JWT no formato `Bearer <token>` |

**Corpo da Requisição:**

```json
{
  "fromAccountNumber": "string",
  "toAccountNumber": "string",
  "amount": 0,
  "password": "string"
}
```

**Respostas:**

- **200 OK**
- **400 Bad Request**
- **404 Not Found**

#### Consulta o saldo de uma conta

```http
GET /transactions/balance
```

| Parâmetro       | Tipo       | Descrição                                  |
|-----------------|------------|--------------------------------------------|
| `accountNumber` | `string`   | **Obrigatório**. Número da conta para verificação do saldo |
| `password`      | `string`   | **Obrigatório**. Senha associada à conta |

**Respostas:**

- **200 OK**
- **400 Bad Request**
- **404 Not Found**

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).
