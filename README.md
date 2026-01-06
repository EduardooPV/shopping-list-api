# Shopping List API

API REST em Node.js construída **sem framework** (usando o módulo nativo `http`), agora totalmente estruturada em **classes e princípios de POO**.  
O objetivo é compreender o funcionamento de baixo nível de uma API: ciclo de vida da requisição/resposta, roteamento manual, middlewares, tratamento centralizado de erros e autenticação com JWT + Refresh Token via cookie HttpOnly.  
A documentação é feita com OpenAPI 3 e renderizada no Scalar em `/docs`.

## Stack

- Node.js 18+ com TypeScript  
- HTTP nativo (`http`)  
- Prisma + PostgreSQL  
- Jest  
- ESLint + Prettier + Husky  
- GitHub Actions  
- Docker Compose (Postgres, Prometheus, Grafana)  
- OpenAPI 3.0 + Scalar (UI em `/docs`)  
- Observabilidade com Prometheus e Grafana  

## Segurança

- JWT (Access Token): Autenticação com expiração curta (15m)
- Refresh Token: HttpOnly cookie para renovação segura
- bcryptjs: Hash de senhas com salt (BCRYPT_COST = 10)
- CORS-ready: Estrutura preparada para adicionar CORS headers

## Banco de Dados

- Prisma ORM: Type-safe database client
- PostgreSQL: Banco de dados relacional
- Migrations: Versionamento de schema com `prisma migrate`
- Cascade Delete: Relacionamentos com deleção em cascata

## Testes

- Jest: Framework de testes unitários
  Cobertura: Unit tests para entities, use cases e errors
- Mocking: Isolamento de componentes (Prisma, crypto, JWT)

## Code Quality

- ESLint + Prettier: Lint e formatação automática
- Husky + lint-staged: Git hooks para validar código antes de commit
- GitHub Actions: CI/CD com validação de PR (título, assignee, labels)


## Deployment

- Docker Compose: Ambiente local com Postgres, Prometheus, Grafana
- Kubernetes: Manifestos prontos (api, postgres, prometheus, grafana)
- Kind: Local K8s cluster para testes

## Wireframes e fluxos

O wireframe abaixo representa o fluxo de telas do aplicativo de lista de compras
e as rotas da API associadas.

### Login e Registro
![Wireflow do app](./docs/wireframes/login.png)

### Lista de compras
![Wireflow do app](./docs/wireframes/list.png)

### Items da lista
![Wireflow do app](./docs/wireframes/list-items.png)

## Scripts

-`dev` – desenvolvimento (watch)

-`build` – compila para `dist/`

-`start` – roda a build

-`unit:test` – testes unitários

-`lint` – ESLint

-`format` – Prettier

## Documentação (OpenAPI + Scalar)

- UI: `GET /docs`
- Spec: `GET /openapi.json`

## Observabilidade (Métricas Prometheus e Grafana)

A API expõe métricas em formato Prometheus em `GET /metrics`.

- `http_requests_total{method,route,status}` — total de requisições por método/rota/status (base para taxa de erro).
- `http_request_duration_seconds_*{method,route,status}` — histograma de latência (serve para p50/p95/p99).
- `api_*` — métricas automáticas do processo Node (CPU, memória, GC, event loop), via `collectDefaultMetrics`.

**Prometheus:**: [http://localhost:9090](http://localhost:9090)  
**Grafana:**: [http://localhost:3000](http://localhost:3000)

## Como rodar

### Com Docker

```bash
docker-compose up -d
npm ci
npx prisma migrate dev
npm run dev
```

### Sem Docker

```bash
# configure DATABASE_URL no .env
npm ci
npx prisma migrate dev
npm run dev
```

### Variaveis de ambiente

.env (exemplo):

```ini
NODE_ENV=development
PORT=3333
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/app?schema=public
SECRET_JWT=...
REFRESH_SECRET_JWT=...
ACCESS_TOKEN_EXPIRATION=15m
REFRESH_TOKEN_EXPIRATION=7d
```
