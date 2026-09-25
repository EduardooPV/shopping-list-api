# Shopping List

Monorepo de uma aplicação de lista de compras. Projeto de estudo com foco em arquitetura, padrões de projeto e features modernas do ecossistema Node.js e React.

[![Checks](https://github.com/EduardooPV/shopping-list-api/actions/workflows/checks.yml/badge.svg)](https://github.com/EduardooPV/shopping-list-api/actions/workflows/checks.yml)

---

## Estrutura

```
shopping-list/
├── api/                  # API REST em Node.js sem framework (http nativo)
│   ├── src/              # Código fonte — Clean Architecture + DDD
│   ├── prisma/           # Schema e migrations (PostgreSQL)
│   ├── bruno/            # Coleções HTTP para teste manual
│   └── README.md         # Documentação completa da API
│
├── app/                  # Frontend em Next.js (App Router)
│   └── README.md         # Documentação do frontend
│
├── k8s/                  # Manifestos Kubernetes (Kind)
├── docs/                 # Documentação compartilhada do projeto
│   ├── FRONTEND.md       # Mapeamento de telas e rotas consumidas
│   └── REACT_NEXTJS_FEATURES.md  # Guia de features React/Next.js
│
├── docker-compose.yml    # Orquestração local completa
├── prometheus.yml        # Configuração do Prometheus
├── kind-config.yaml      # Configuração do cluster Kind
└── Makefile              # Comandos de desenvolvimento
```

---

## Stack

| Camada      | Tecnologia                                |
|-------------|-------------------------------------------|
| API         | Node.js 20 + TypeScript 5 (sem framework) |
| Banco       | PostgreSQL 16 + Prisma ORM                |
| Frontend    | Next.js (App Router) + React 19           |
| Estilização | Tailwind CSS 4                            |
| Infra local | Docker Compose                            |
| Orquestração| Kubernetes (Kind)                         |
| Observação  | Prometheus + Grafana                      |
| CI/CD       | GitHub Actions                            |

---

## Portas

| Serviço    | Porta  |
|------------|--------|
| App        | 3000   |
| API        | 3333   |
| Grafana    | 3001   |
| Prometheus | 9090   |
| PostgreSQL | 5433   |

---

## Rodando localmente

### Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) e Docker Compose
- [Node.js 20+](https://github.com/nvm-sh/nvm) (via nvm)
- [Make](https://www.gnu.org/software/make/)

### Variáveis de ambiente

```bash
cp api/.env.example api/.env   # edite com seus valores
```

### Subindo tudo

```bash
make dev          # sobe infraestrutura + API + App via Docker (hot reload)
make stop         # para e remove todos os containers
make logs         # acompanha os logs em tempo real
```

### Comandos individuais

```bash
make infra        # sobe só postgres + prometheus + grafana
make api          # sobe infra + API
make app          # sobe infra + API + App
```

### Desenvolvimento local (sem Docker para o código)

```bash
make infra        # infra em background via Docker

cd api && npm install && npm run dev   # API com hot reload
cd app && npm install && npm run dev   # App com hot reload
```

---

## Documentação

Cada subprojeto tem seu próprio README com detalhes de arquitetura, padrões e decisões:

- **[`api/README.md`](api/README.md)** — rotas, arquitetura Clean + DDD, padrões implementados, variáveis de ambiente, testes
- **[`app/README.md`](app/README.md)** — estrutura de pastas, features React/Next.js, convenções

---

## CI/CD

| Workflow          | Trigger | O que faz                                              |
|-------------------|---------|--------------------------------------------------------|
| `checks.yml`      | PR      | lint, format check e testes unitários da API           |
| `validate-pr.yml` | PR      | valida título (`feat/fix/chore/docs/test:`), assignee e label |

---

## Infraestrutura

Os manifestos Kubernetes em [`k8s/`](k8s/) rodam num cluster local com [Kind](https://kind.sigs.k8s.io/). Ver [`kind-config.yaml`](kind-config.yaml) para configuração do cluster.
