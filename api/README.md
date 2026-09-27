<h1 align="center">Shopping List API</h1>

<p align="center">
  API REST em Node.js construída <strong>sem framework</strong> (módulo nativo <code>http</code>), com JWT + refresh token, testes unitários, observabilidade com Prometheus/Grafana e deploy Kubernetes.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js 18+" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Jest-tests-C21325?style=flat-square&logo=jest&logoColor=white" alt="Jest" />
  <img src="https://img.shields.io/badge/Prometheus-metrics-E6522C?style=flat-square&logo=prometheus&logoColor=white" alt="Prometheus" />
  <img src="https://img.shields.io/badge/Grafana-dashboards-F46800?style=flat-square&logo=grafana&logoColor=white" alt="Grafana" />
  <img src="https://img.shields.io/badge/Kubernetes-deploy-326CE5?style=flat-square&logo=kubernetes&logoColor=white" alt="Kubernetes" />
</p>

<p align="center">
  <a href="#sobre-o-projeto">Sobre o projeto</a> ·
  <a href="#stack">Stack</a> ·
  <a href="#arquitetura">Arquitetura</a> ·
  <a href="#rotas">Rotas</a> ·
  <a href="#como-rodar">Como rodar</a> ·
  <a href="#testes">Testes</a> ·
  <a href="#observabilidade">Observabilidade</a>
</p>

---

## Sobre o projeto

Backend de um gerenciador de listas de compras: usuários criam conta, montam listas, adicionam itens com nome, quantidade e valor, marcam itens como concluídos, e consultam um resumo com total gasto e contagem de pendentes/concluídos.

O objetivo é compreender o funcionamento de baixo nível de uma API HTTP: roteamento manual, middlewares encadeados, parsing de body/cookie/query, serialização de respostas e autenticação com JWT + Refresh Token via cookie HttpOnly — tudo sem Express ou Fastify.

A documentação é gerada com OpenAPI 3 e renderizada pelo Scalar em `/docs`.

---

## Stack

| Camada          | Tecnologia                                     |
| --------------- | ---------------------------------------------- |
| Runtime         | Node.js 18+ com TypeScript 5 (strict)          |
| HTTP            | Módulo nativo `node:http` (sem framework)      |
| Banco de dados  | Prisma ORM + PostgreSQL 16                     |
| Testes          | Jest + ts-jest (unitários)                     |
| Documentação    | OpenAPI 3 + Scalar (`GET /docs`)               |
| Observabilidade | Prometheus + Grafana                           |
| Qualidade       | ESLint + Prettier + Husky + lint-staged        |
| CI/CD           | GitHub Actions                                 |
| Infraestrutura  | Docker Compose + Kubernetes (Kind)             |

---

## Arquitetura

### Clean Architecture + DDD por módulo

```
src/
├── core/          # Infraestrutura HTTP genérica
│   ├── database/  # Singleton do PrismaClient
│   └── http/      # App, Router, middlewares, controllers de docs/metrics
├── modules/       # Domínios de negócio
│   └── <modulo>/
│       ├── application/   # Use Cases + DTOs + ViewModels
│       ├── domain/        # Entities, erros de domínio, interfaces de repositório
│       └── infrastructure/# Implementações: DB (Prisma), HTTP (Controllers, Routes, Docs)
└── shared/        # Utilitários cross-módulo (env, erros base, OpenAPI builder, paginação)
```

### Módulos de domínio

| Módulo     | Responsabilidade                                      |
|------------|-------------------------------------------------------|
| `users`    | CRUD de usuário, hash de senha com bcryptjs           |
| `auth`     | Login, logout, refresh token via cookie HttpOnly      |
| `shopping` | CRUD de listas de compras (paginado)                  |
| `item`     | CRUD de itens dentro de uma lista                     |

### Padrões implementados

| Padrão             | Onde                                                                   |
|--------------------|------------------------------------------------------------------------|
| Repository Pattern | `domain/repositories/` → interfaces; `infrastructure/database/` → implementações Prisma |
| Use Case Pattern   | Cada operação tem seu próprio use case com `execute()`                 |
| Value Object       | `UserName` — valida, normaliza e congela o valor                       |
| Entity com UUID    | `User`, `ShoppingList`, `ItemList` geram IDs via `crypto.randomUUID()` |
| Error Catalog      | `AppError` + `HttpErrorMapper` → converte qualquer erro para `{status, body}` |
| Middleware Chain   | `App` encadeia `LoggerMiddleware → MetricsRecorderMiddleware → ErrorMiddleware` |
| Builder / Fluent   | `OpenApiSpecBuilder` constrói o spec OpenAPI programaticamente         |
| Singleton          | `PrismaClient` instanciado uma vez em `core/database/`                 |
| ViewModel          | Formata a saída antes de chegar ao controller                          |

### HTTP engine — implementado à mão

- **`Router`** — registra `{method, path, middlewares?, handler}`, resolve pathname, prioriza rotas literais sobre parametrizadas, extrai `:id`
- **`BodyParser`** — lê stream do `IncomingMessage`, respeita `Content-Type: application/json`, limita a 1MB
- **`QueryParser`** — extrai query strings via `URL.searchParams`
- **`CookieSerializer`** — serializa cookies com `HttpOnly`, `Secure`, `SameSite`, `Max-Age`
- **`parseCookie`** — parse da string `Cookie:` do header
- **`ReplyResponder`** — `ok`, `created`, `noContent`, `json`, `text`, `html`; calcula `Content-Length`
- **`PaginationHelper`** — extrai e sanitiza `page/per_page`, computa `skip/take` para o Prisma

---

## Autenticação

- **Access Token**: JWT com expiração curta (padrão 15m), enviado no header `Authorization: Bearer <token>`
- **Refresh Token**: JWT com expiração longa (padrão 7d), armazenado no banco e trafegado como cookie `HttpOnly`. Na renovação, o token antigo é validado contra o banco — **token rotation manual**
- **`EnsureAuthenticatedMiddleware`**: extrai o bearer token, verifica assinatura e injeta `req.userId`

---

## Rotas

| Método | Rota                                    | Auth | Descrição                  |
|--------|-----------------------------------------|------|----------------------------|
| POST   | `/users`                                | —    | Criar usuário              |
| GET    | `/users/me`                             | JWT  | Obter usuário autenticado  |
| PUT    | `/users/me`                             | JWT  | Atualizar usuário          |
| DELETE | `/users/me`                             | JWT  | Deletar usuário            |
| POST   | `/auth/login`                           | —    | Login (retorna tokens)     |
| POST   | `/auth/logout`                          | JWT  | Logout (limpa refresh)     |
| POST   | `/auth/refresh`                         | —    | Renovar access token       |
| POST   | `/shopping-lists`                       | JWT  | Criar lista                |
| GET    | `/shopping-lists`                       | JWT  | Listar (paginado)          |
| PUT    | `/shopping-lists/:id`                   | JWT  | Atualizar lista            |
| DELETE | `/shopping-lists/:id`                   | JWT  | Deletar lista              |
| GET    | `/shopping-lists/:id`                   | JWT  | Buscar lista por ID        |
| POST   | `/shopping-lists/:id/items`             | JWT  | Criar item                 |
| GET    | `/shopping-lists/:id/items`             | JWT  | Listar itens               |
| PUT    | `/shopping-lists/:id/items/:itemId`     | JWT  | Atualizar item             |
| DELETE | `/shopping-lists/:id/items/:itemId`     | JWT  | Deletar item               |
| GET    | `/docs`                                 | —    | UI Scalar (OpenAPI)        |
| GET    | `/openapi.json`                         | —    | Spec OpenAPI bruta         |
| GET    | `/metrics`                              | —    | Métricas Prometheus        |

---

## Como rodar

### Com Docker (recomendado)

```bash
# Na raiz do monorepo
make dev
```

### Sem Docker

```bash
# Configure DATABASE_URL no .env
cd api
npm ci
npx prisma migrate dev
npm run dev
```

---

## Variáveis de ambiente

| Variável                  | Obrigatória | Padrão / Exemplo                        |
|---------------------------|-------------|-----------------------------------------|
| `DATABASE_URL`            | sim         | `postgresql://postgres:...@localhost/app` |
| `PORT`                    | não         | `3333`                                  |
| `NODE_ENV`                | não         | `development`                           |
| `SECRET_JWT`              | sim         | mín. 25 chars                           |
| `REFRESH_SECRET_JWT`      | sim         | mín. 25 chars                           |
| `ACCESS_TOKEN_EXPIRATION` | não         | `15m`                                   |
| `REFRESH_TOKEN_EXPIRATION`| não         | `7d`                                    |

Validação feita no boot via Zod (`shared/utils/env.ts`). Em `NODE_ENV=test` os erros são ignorados com valores de fallback.

---

## Scripts

| Comando              | Descrição                           |
|----------------------|-------------------------------------|
| `npm run dev`        | Desenvolvimento com hot reload      |
| `npm run build`      | Compila TypeScript → `dist/`        |
| `npm run start`      | Roda a build compilada              |
| `npm run test:unit`  | Testes unitários com Jest           |
| `npm run lint`       | ESLint                              |
| `npm run format`     | Prettier (write)                    |
| `npm run format:check` | Prettier (check, usado no CI)    |

---

## Testes

Apenas testes unitários (sem tocar o banco de dados).

**Cobertura:** entities, use cases, controllers, erros de domínio, utilitários shared.

- **Use cases**: repositório mockado com `jest.fn()` — nunca toca o Prisma
- **Controllers**: `BodyParser.parse` e `ReplyResponder` são spies via `jest.spyOn`
- **Erros**: verificam `code`, `message`, `isOperational` e herança de `AppError`
- **Entities**: verificam geração de ID e imutabilidade (`Object.freeze`)

Todos os arquivos de teste usam `// @ts-nocheck` para evitar ruído de tipagem nos mocks.

---

## Documentação (OpenAPI + Scalar)

- **UI interativa**: `GET /docs`
- **Spec bruta**: `GET /openapi.json`

O spec é montado programaticamente com `OpenApiSpecBuilder` e cacheado (lazy singleton). Cada módulo exporta seu próprio objeto de docs que é mergeado no spec final.

---

## Observabilidade

`GET /metrics` expõe métricas no formato Prometheus:

- `http_requests_total{method,route,status}` — counter de requisições
- `http_request_duration_seconds{method,route,status}` — histograma de latência (p50/p95/p99)
- `api_*` — métricas automáticas do processo Node (CPU, memória, GC, event loop)

**Prometheus**: `http://localhost:9090`  
**Grafana**: `http://localhost:3001`

---

## Segurança

- **bcryptjs** — hash de senhas com salt (`BCRYPT_COST = 10`)
- **JWT de curta duração** — access token expira em 15m por padrão
- **Cookie HttpOnly** — refresh token nunca acessível via JavaScript
- **Token Rotation** — refresh tokens são invalidados no banco a cada renovação
- **Validação Zod** — todos os payloads de entrada validados antes de chegar ao use case

---

## CI/CD

| Workflow          | Trigger | O que faz                                              |
|-------------------|---------|--------------------------------------------------------|
| `checks.yml`      | PR      | lint, format:check, testes unitários                   |
| `validate-pr.yml` | PR      | título no padrão `feat/fix/chore/docs/test:`, assignee e label obrigatórios |

---

<p align="center">
  Desenvolvido por <strong>Luiz Eduardo Veltroni</strong> ·
  <a href="https://github.com/EduardooPV">GitHub</a> ·
  <a href="https://www.linkedin.com/in/luiz-veltroni/">LinkedIn</a>
</p>
