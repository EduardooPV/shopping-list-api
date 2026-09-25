# CLAUDE.md — shopping-list-api

## Visão geral

API REST em Node.js **sem framework** (módulo nativo `http`), escrita 100% à mão como projeto de estudo de arquitetura, padrões de projeto e fundamentos de HTTP. Todo o ciclo de vida da requisição — roteamento, middlewares, parsing de body/cookie/query, serialização de respostas e tratamento de erros — foi implementado manualmente. Nenhum Express, Fastify ou equivalente é usado.

---

## Stack

| Camada          | Tecnologia                                    |
|-----------------|-----------------------------------------------|
| Runtime         | Node.js 18+ com TypeScript 5 (strict mode)    |
| HTTP            | Módulo nativo `node:http`                     |
| Banco de dados  | Prisma + PostgreSQL 16                        |
| Testes          | Jest + ts-jest (unitários apenas)             |
| Documentação    | OpenAPI 3 montada manualmente + Scalar (`/docs`) |
| Observabilidade | Prometheus (`/metrics`) + Grafana             |
| Qualidade       | ESLint + Prettier + Husky + lint-staged       |
| CI/CD           | GitHub Actions (lint, format, testes, validação de PR) |
| Infraestrutura  | Docker Compose + Kubernetes (Kind)            |

---

## Arquitetura

### Clean Architecture + DDD por módulo

```
src/
├── core/          # Infraestrutura HTTP genérica (não pertence a nenhum módulo)
│   ├── database/  # Singleton do PrismaClient
│   └── http/      # App, Router, middlewares, utils, controllers de docs/metrics
├── modules/       # Domínios de negócio (auth, users, shopping, item)
│   └── <modulo>/
│       ├── application/   # Use Cases + DTOs + ViewModels
│       ├── domain/        # Entities, erros de domínio, interfaces de repositório
│       ├── infrastructure/# Implementações: DB (Prisma), HTTP (Controllers, Routes, Docs)
│       └── __tests__/     # Testes unitários espelhando a estrutura acima
└── shared/        # Utilitários cross-módulo (env, erros base, OpenAPI builder, paginação)
```

### Módulos de domínio

| Módulo     | Responsabilidade                                      |
|------------|-------------------------------------------------------|
| `users`    | CRUD de usuário, hash de senha com bcryptjs           |
| `auth`     | Login, logout, refresh token via cookie HttpOnly      |
| `shopping` | CRUD de listas de compras (paginado)                  |
| `item`     | CRUD de itens dentro de uma lista                     |

---

## Padrões de projeto implementados

### 1. Repository Pattern
Repositórios definidos como interfaces em `domain/repositories/` e implementados em `infrastructure/database/`. Use Cases dependem apenas da interface, nunca da implementação concreta — isso permite mockar nos testes sem tocar o Prisma.

```
IUsersRepository (interface) ← CreateUserUseCase
PostgresUsersRepository      ← implementa IUsersRepository
```

### 2. Use Case Pattern (Application Services)
Cada operação de negócio tem seu próprio use case com método `execute()`. Os use cases recebem o repositório via injeção de dependência no construtor.

### 3. Value Object
`UserName` (`modules/users/domain/object-values/user-name.ts`) encapsula validações de nome do usuário (mínimo 2, máximo 50 chars, trimado), expõe `getValue()` e `equals()`, e é imutável via `Object.freeze`.

### 4. Entity com identidade gerada no domínio
`User`, `ShoppingList` e `ItemList` geram seus IDs via `crypto.randomUUID()` dentro do construtor. Entidades são imutáveis (`readonly` + `Object.freeze` em User).

### 5. Error Catalog + Translator (Chain of Responsibility-like)
`AppError` é a classe base para todos os erros de domínio. O `HttpStatusMapper` mapeia códigos de string para status HTTP. O `HttpErrorMapper` converte qualquer `unknown` (AppError, ZodError, SyntaxError, erro genérico) para um objeto `{ status, body }`. Isso centraliza todo tratamento de erro num único lugar.

### 6. Middleware Chain manual
Os middlewares (`ErrorMiddleware`, `MetricsRecorderMiddleware`, `LoggerMiddleware`) são encadeados no `App` como funções assíncronas com assinatura `(req, res, next)`. O Router também suporta middlewares por rota (ex: `EnsureAuthenticatedMiddleware`).

### 7. Builder / Fluent Builder
`OpenApiRouteBuilder.build()` e `OpenApiSpecBuilder` constroem a especificação OpenAPI programaticamente. O spec é montado uma vez e cacheado (lazy singleton). Cada módulo exporta seu próprio objeto de docs que é mergeado no spec final.

### 8. Singleton
`PrismaClient` é instanciado uma vez em `core/database/prisma-client.ts` e exportado como singleton.

### 9. Static Factory / Service Class
Controllers, use cases e repositórios são instanciados estaticamente dentro das classes de rotas (ex: `UserRoutes`), atuando como composição explícita (poor man's DI container).

### 10. ViewModel
Cada use case que retorna dados tem um ViewModel associado (`get-user-view-model.ts`, etc.) que formata a saída antes de chegar ao controller.

---

## HTTP engine — o que foi escrito à mão

Tudo abaixo foi implementado sem nenhuma biblioteca HTTP:

- **`Router`**: registra rotas `{ method, path, middlewares?, handler }`, resolve pelo pathname, ordena candidatos priorizando rotas literais sobre parameterizadas, extrai params (`:id`) via segmento.
- **`PathMatcher`**: alternativa regex para matching, converte `:param` em grupos de captura.
- **`BodyParser`**: lê o stream de dados do `IncomingMessage`, respeita `Content-Type: application/json`, limita a 1MB, parseia JSON.
- **`QueryParser`**: extrai query strings via `URL.searchParams`.
- **`CookieSerializer`**: serializa cookies com todas as opções (`HttpOnly`, `Secure`, `SameSite`, `Max-Age`, `Path`, `Domain`).
- **`parseCookie`**: parse de string `Cookie:` do header.
- **`ReplyResponder`**: abstração de resposta com métodos `ok`, `created`, `noContent`, `json`, `text`, `html`. Calcula `Content-Length` com `Buffer.byteLength`.
- **`PaginationHelper`**: extrai e sanitiza `page` / `per_page` da query string, computa `skip` e `take` para o Prisma.

---

## Autenticação

- **Access Token**: JWT com expiração curta (`SECRET_JWT`, default 15m), passado no header `Authorization: Bearer <token>`.
- **Refresh Token**: JWT com expiração longa (`REFRESH_SECRET_JWT`, default 7d), armazenado no banco e enviado/recebido como cookie `HttpOnly`. Na renovação, o token antigo é validado contra o banco — token rotation manual.
- **`EnsureAuthenticatedMiddleware`**: extrai o bearer token, verifica assinatura e adiciona `req.userId` para uso nos controllers.

---

## Observabilidade

`GET /metrics` expõe:
- `http_requests_total{method,route,status}` — Counter
- `http_request_duration_seconds{method,route,status}` — Histogram (buckets: 5ms–5s)
- `api_*` — métricas automáticas de processo Node via `collectDefaultMetrics`

A rota é identificada pelo campo `metricsRoute` injetado no `req` pelo Router antes de despachar para o handler.

---

## Comandos

```bash
npm run dev           # desenvolvimento com nodemon + tsconfig-paths
npm run build         # compilação TypeScript → dist/
npm run start         # roda a build compilada
npm run test:unit     # Jest (unitários)
npm run lint          # ESLint
npm run format        # Prettier (write)
npm run format:check  # Prettier (check, usado no CI)
```

---

## Variáveis de ambiente

| Variável                  | Obrigatória | Exemplo / default         |
|---------------------------|-------------|---------------------------|
| `DATABASE_URL`            | sim         | `postgresql://...`        |
| `PORT`                    | não         | `3000`                    |
| `NODE_ENV`                | não         | `development`             |
| `SECRET_JWT`              | sim         | mín. 25 chars             |
| `REFRESH_SECRET_JWT`      | sim         | mín. 25 chars             |
| `ACCESS_TOKEN_EXPIRATION` | não         | `15m`                     |
| `REFRESH_TOKEN_EXPIRATION`| não         | `7d`                      |

Validação feita no boot via Zod em `shared/utils/env.ts` — em `NODE_ENV=test` os erros são ignorados com valores de fallback.

---

## Testes

Apenas testes unitários. Cobertura: entities, use cases, errors, controllers, e utilitários shared.

- **Use cases**: o repositório é um objeto mock (`jest.fn()`), nunca toca o Prisma.
- **Controllers**: `BodyParser.parse` e `ReplyResponder` são spies/mocks via `jest.spyOn`.
- **Errors**: testam `code`, `message`, `isOperational` e herança de `AppError`.
- **Entities**: verificam geração de ID e imutabilidade.

Todos os arquivos de teste usam `// @ts-nocheck` para evitar ruído de tipagem nos mocks.

---

## CI/CD (GitHub Actions)

| Workflow            | Trigger    | O que faz                                          |
|---------------------|------------|----------------------------------------------------|
| `checks.yml`        | PR         | lint, format:check, test:unit                      |
| `validate-pr.yml`   | PR         | título no padrão `feat/fix/chore/docs/test:`, assignee e label obrigatórios |

---

## Rotas disponíveis

| Método | Rota                                    | Auth | Descrição                  |
|--------|-----------------------------------------|------|----------------------------|
| POST   | `/users`                                | —    | Criar usuário              |
| GET    | `/users`                                | JWT  | Obter usuário autenticado  |
| PUT    | `/users`                                | JWT  | Atualizar usuário          |
| DELETE | `/users`                                | JWT  | Deletar usuário            |
| POST   | `/auth/login`                           | —    | Login (retorna tokens)     |
| POST   | `/auth/logout`                          | JWT  | Logout (limpa refresh)     |
| POST   | `/auth/refresh`                         | —    | Renovar access token       |
| POST   | `/shopping-lists`                       | JWT  | Criar lista                |
| GET    | `/shopping-lists`                       | JWT  | Listar (paginado)          |
| PUT    | `/shopping-lists/:id`                   | JWT  | Atualizar lista            |
| DELETE | `/shopping-lists/:id`                   | JWT  | Deletar lista              |
| GET    | `/shopping-lists/:id`                   | JWT  | Resumo da lista            |
| POST   | `/shopping-lists/:id/items`             | JWT  | Criar item                 |
| GET    | `/shopping-lists/:id/items`             | JWT  | Listar itens               |
| PUT    | `/shopping-lists/:id/items/:itemId`     | JWT  | Atualizar item             |
| DELETE | `/shopping-lists/:id/items/:itemId`     | JWT  | Deletar item               |
| GET    | `/docs`                                 | —    | UI Scalar (OpenAPI)        |
| GET    | `/openapi.json`                         | —    | Spec OpenAPI bruta         |
| GET    | `/metrics`                              | —    | Métricas Prometheus        |
