<h1 align="center">Shopping List API</h1>

<p align="center">
  API REST em Node.js sem framework (http nativo), com JWT + refresh token, testes, observabilidade (Prometheus/Grafana) e deploy Kubernetes.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js 18+" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-db-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Jest-tests-C21325?style=flat-square&logo=jest&logoColor=white" alt="Jest" />
  <img src="https://img.shields.io/badge/Prometheus-metrics-E6522C?style=flat-square&logo=prometheus&logoColor=white" alt="Prometheus" />
  <img src="https://img.shields.io/badge/Grafana-dashboards-F46800?style=flat-square&logo=grafana&logoColor=white" alt="Grafana" />
  <img src="https://img.shields.io/badge/Kubernetes-deploy-326CE5?style=flat-square&logo=kubernetes&logoColor=white" alt="Kubernetes" />
</p>

<p align="center">
  <a href="#sobre-o-projeto">Sobre o projeto</a> ·
  <a href="#stack">Stack</a> ·
  <a href="#wireframes-e-fluxos">Wireframes e fluxos</a> ·
  <a href="#como-rodar">Como rodar</a> ·
  <a href="#observabilidade">Observabilidade</a>
</p>

---

## Sobre o projeto

API REST em Node.js construída **sem framework** (usando o módulo nativo `http`), agora totalmente estruturada em **classes e princípios de POO**.  
O objetivo é compreender o funcionamento de baixo nível de uma API: ciclo de vida da requisição/resposta, roteamento manual, middlewares, tratamento centralizado de erros e autenticação com JWT + Refresh Token via cookie HttpOnly.  
A documentação é feita com OpenAPI 3 e renderizada no Scalar em `/docs`.

---

## Stack

| Camada          | Tecnologia                                    |
|-----------------|-----------------------------------------------|
| Runtime         | Node.js 18+ com TypeScript                    |
| HTTP            | Módulo nativo `http` (sem framework)          |
| Banco de dados  | Prisma + PostgreSQL                           |
| Testes          | Jest                                          |
| Documentação    | OpenAPI 3.0 + Scalar (UI em `/docs`)          |
| Observabilidade | Prometheus e Grafana                          |
| Qualidade       | ESLint + Prettier + Husky                     |
| CI/CD           | GitHub Actions                                |
| Infraestrutura  | Docker Compose (Postgres, Prometheus, Grafana) |

---

## Wireframes e fluxos

O wireframe abaixo representa o fluxo de telas do aplicativo de lista de compras
e as rotas da API associadas.

### Login e Registro
![Wireflow do app](./docs/wireframes/login.png)

### Lista de compras
![Wireflow do app](./docs/wireframes/list.png)

### Items da lista
![Wireflow do app](./docs/wireframes/list-items.png)

---

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

---

## Variáveis de ambiente

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

---

## Scripts

-`dev` – desenvolvimento (watch)

-`build` – compila para `dist/`

-`start` – roda a build

-`unit:test` – testes unitários

-`lint` – ESLint

-`format` – Prettier

---

## Testes

- Jest: Framework de testes unitários
  Cobertura: Unit tests para entities, use cases e errors
- Mocking: Isolamento de componentes (Prisma, crypto, JWT)

---

## Documentação (OpenAPI + Scalar)

- UI: `GET /docs`
- Spec: `GET /openapi.json`

---

## Observabilidade (Métricas Prometheus e Grafana)

A API expõe métricas em formato Prometheus em `GET /metrics`.

- `http_requests_total{method,route,status}` — total de requisições por método/rota/status (base para taxa de erro).
- `http_request_duration_seconds_*{method,route,status}` — histograma de latência (serve para p50/p95/p99).
- `api_*` — métricas automáticas do processo Node (CPU, memória, GC, event loop), via `collectDefaultMetrics`.

**Prometheus:**: [http://localhost:9090](http://localhost:9090)  
**Grafana:**: [http://localhost:3000](http://localhost:3000)

---

## Banco de dados

- Prisma ORM: Type-safe database client
- PostgreSQL: Banco de dados relacional
- Migrations: Versionamento de schema com `prisma migrate`
- Cascade Delete: Relacionamentos com deleção em cascata

---

## Segurança

- JWT (Access Token): Autenticação com expiração curta (15m)
- Refresh Token: HttpOnly cookie para renovação segura
- bcryptjs: Hash de senhas com salt (BCRYPT_COST = 10)
- CORS-ready: Estrutura preparada para adicionar CORS headers

---

## Qualidade de código

- ESLint + Prettier: Lint e formatação automática
- Husky + lint-staged: Git hooks para validar código antes de commit
- GitHub Actions: CI/CD com validação de PR (título, assignee, labels)

---

## CI/CD e deploy

- Docker Compose: Ambiente local com Postgres, Prometheus, Grafana
- Kubernetes: Manifestos prontos (api, postgres, prometheus, grafana)
- Kind: Local K8s cluster para testes

---

<p align="center">
  Desenvolvido por <strong>Luiz Eduardo Veltroni</strong> ·
  <a href="https://github.com/EduardooPV">GitHub</a> ·
  <a href="https://www.linkedin.com/in/luiz-veltroni/">LinkedIn</a>
</p>
