# Abstrax — Gerador de Arte Abstrata

Plataforma web para criar, explorar e compartilhar obras de arte geradas por algoritmos.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js 15, TypeScript, Tailwind CSS, shadcn/ui |
| Backend | Node.js, Express 5, TypeScript, ts-node |
| Banco de dados | PostgreSQL 16 |
| ORM | Prisma |
| Autenticação | JWT |
| Infraestrutura | Docker + Docker Compose |

---

## Pré-requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e **rodando**
- Git

Não é necessário instalar Node.js, pnpm ou PostgreSQL localmente — tudo roda dentro do Docker.

---

## Instalação

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/abstrax.git
cd abstrax
```

### 2. Configurar variáveis de ambiente

Crie o arquivo `frontend/env.local` com o seguinte conteúdo:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

> **Importante:** o `/api` no final é obrigatório. Todas as rotas do backend usam o prefixo `/api` (ex: `/api/auth/register`, `/api/arts`).

O arquivo `.env` na raiz já está configurado corretamente para Docker e não precisa ser alterado.

### 3. Subir os containers

```bash
docker compose up --build
```

Na primeira execução, o Docker vai:
1. Baixar as imagens base (Node.js 20, PostgreSQL 16)
2. Instalar as dependências do backend e frontend
3. Gerar o Prisma Client
4. Subir os 3 containers (banco, backend, frontend)
5. Aplicar automaticamente todas as migrations do banco

Quando aparecer isso no terminal, está pronto:

```
abstrax-backend   | Servidor rodando na porta 4000
abstrax-frontend  | ✓ Ready in Xs
```

### 4. Acessar

| Serviço | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend (API) | http://localhost:4000 |
| Health check | http://localhost:4000/health |

Credenciais do banco (para acesso via cliente SQL como DBeaver ou TablePlus):

```
Host:     localhost
Porta:    5432
Usuário:  postgres
Senha:    postgres
Database: abstrax
```

---

## Uso diário

### Subir o projeto (sem rebuild)

```bash
docker compose up
```

### Subir com rebuild (após mudar Dockerfile ou package.json)

```bash
docker compose up --build
```

### Parar os containers

```bash
docker compose down
```

### Ver logs em tempo real

```bash
# Todos os serviços
docker compose logs --follow

# Só o backend
docker compose logs backend --follow

# Só o frontend
docker compose logs frontend --follow
```

### Resetar tudo (banco incluído)

```bash
docker compose down -v
docker compose up --build
```

> ⚠️ O `-v` apaga os volumes, incluindo todos os dados do banco. Use só quando quiser começar do zero.

---

## Estrutura do projeto

```
abstrax/
├── docker-compose.yml          # Orquestração dos containers
├── .env                        # Variáveis de ambiente (raiz)
│
├── backend/
│   ├── Dockerfile
│   ├── nodemon.json            # Configuração do hot reload com ts-node
│   ├── package.json
│   ├── prisma/
│   │   ├── schema.prisma       # Modelos do banco
│   │   └── migrations/        # Histórico de migrations
│   └── src/
│       ├── server.ts           # Entry point
│       ├── app.ts              # Express app (middlewares, CORS)
│       ├── controllers/
│       ├── services/
│       ├── routes/
│       ├── middleware/
│       └── utils/
│
└── frontend/
    ├── Dockerfile
    ├── env.local               # Variáveis do Next.js (NEXT_PUBLIC_*)
    ├── next.config.mjs
    ├── app/                    # App Router do Next.js
    ├── components/
    └── services/
        └── api.ts              # Todas as chamadas ao backend
```

---

## Rotas da API

Todas as rotas usam o prefixo `/api`. O token JWT deve ser enviado no header:

```
Authorization: Bearer <token>
```

### Autenticação

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| POST | `/api/auth/register` | Não | Criar conta |
| POST | `/api/auth/login` | Não | Login |
| GET | `/api/auth/profile` | Sim | Perfil do usuário logado |
| PUT | `/api/auth/profile` | Sim | Atualizar perfil |
| PUT | `/api/auth/profile/password` | Sim | Alterar senha |

### Artes

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| GET | `/api/arts/public` | Não | Listar artes públicas |
| GET | `/api/arts/user/arts` | Sim | Listar artes do usuário |
| POST | `/api/arts` | Sim | Criar arte |
| GET | `/api/arts/:id` | Sim | Buscar arte |
| PUT | `/api/arts/:id` | Sim | Atualizar arte |
| DELETE | `/api/arts/:id` | Sim | Deletar arte |
| POST | `/api/arts/:id/image` | Sim | Upload de imagem |
| PUT | `/api/arts/:id/visibility` | Sim | Alterar visibilidade |

### Álbuns

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| GET | `/api/albums/user/albums` | Sim | Listar álbuns do usuário |
| POST | `/api/albums` | Sim | Criar álbum |
| GET | `/api/albums/:id` | Sim | Buscar álbum |
| PUT | `/api/albums/:id` | Sim | Atualizar álbum |
| DELETE | `/api/albums/:id` | Sim | Deletar álbum |
| GET | `/api/albums/:id/arts` | Sim | Listar artes do álbum |
| POST | `/api/albums/art/:artId/move` | Sim | Mover arte para álbum |

### Usuários

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| GET | `/api/users/me` | Sim | Dados do usuário |
| PUT | `/api/users/me` | Sim | Atualizar usuário |
| PUT | `/api/users/me/password` | Sim | Alterar senha |
| POST | `/api/users/me/avatar` | Sim | Upload de avatar |
| GET | `/api/users/:id/avatar` | Não | Buscar avatar |

### Sistema

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| GET | `/health` | Não | Health check |
| GET | `/` | Não | Rota raiz |

---

## Banco de dados

As migrations são aplicadas **automaticamente** quando o backend sobe. Não é necessário rodar nenhum comando manualmente.

Para criar uma nova migration após alterar o `schema.prisma`:

```bash
docker compose exec backend pnpm prisma migrate dev --name nome_da_migration
```

Para acessar o banco via terminal:

```bash
docker compose exec postgres psql -U postgres -d abstrax
```

---

## Decisões técnicas relevantes

**`bcryptjs` em vez de `bcrypt`**
O `bcrypt` usa um binário nativo compilado em C++. Com Docker + pnpm + Alpine Linux, esse binário não era encontrado em runtime por causa de como o pnpm gerencia symlinks com o volume mount. Substituído por `bcryptjs`, implementação 100% JavaScript com API idêntica.

**`ts-node --transpile-only`**
O backend roda TypeScript diretamente em desenvolvimento via ts-node. O flag `--transpile-only` desativa a checagem de tipos em runtime (mantendo apenas a transpilação), o que evita que erros de tipo impeçam o servidor de subir durante o desenvolvimento.

**`NEXT_PUBLIC_API_URL` com `/api`**
O prefixo `/api` faz parte da URL base configurada no frontend (`http://localhost:4000/api`), não dos paths individuais. Isso mantém o `services/api.ts` limpo com paths como `/auth/register` em vez de `/api/auth/register`.

**Healthcheck no PostgreSQL**
O backend usa `depends_on` com `condition: service_healthy` para aguardar o PostgreSQL estar pronto antes de subir e aplicar as migrations, evitando erros de conexão recusada no startup.