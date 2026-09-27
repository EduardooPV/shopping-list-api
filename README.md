# Shopping List

Aplicativo mobile-first de lista de compras — monorepo com API REST em Node.js puro e frontend em Next.js com React 19.

[![Checks](https://github.com/EduardooPV/shopping-list-api/actions/workflows/checks.yml/badge.svg)](https://github.com/EduardooPV/shopping-list-api/actions/workflows/checks.yml)

---

## O que é

Uma aplicação completa de lista de compras onde o usuário pode:

- **Criar conta e fazer login** com sessão via JWT + Refresh Token
- **Criar e organizar múltiplas listas** (mercado, material escolar, churrasco...)
- **Adicionar itens** com nome, quantidade e valor
- **Concluir itens** com swipe horizontal ou toque no checkbox
- **Acompanhar o progresso** pela barra de concluídos no topo
- **Ver o total gasto** por lista
- **Gerenciar o perfil** (editar nome, e-mail, senha)

---

## Telas

https://github.com/user-attachments/assets/ae6b6738-b353-43e7-b6d0-f00bba818fae

---

## Estrutura do monorepo

```
shopping-list/
├── api/              # API REST em Node.js sem framework (http nativo)
│   ├── src/          # Clean Architecture + DDD por módulo
│   ├── prisma/       # Schema e migrations (PostgreSQL)
│   ├── bruno/        # Coleções HTTP para teste manual
│   └── README.md     # Documentação completa da API ↗
│
├── app/              # Frontend em Next.js (App Router)
│   └── README.md     # Documentação do frontend ↗
│
├── k8s/              # Manifestos Kubernetes (Kind)
├── docs/             # Wireframes, guias e screenshots
├── docker-compose.yml
├── prometheus.yml
├── kind-config.yaml
└── Makefile          # Comandos de desenvolvimento
```

---

## Stack

| Camada      | Tecnologia                                |
|-------------|-------------------------------------------|
| API         | Node.js 20 + TypeScript 5 (sem framework) |
| Banco       | PostgreSQL 16 + Prisma ORM                |
| Frontend    | Next.js 16 (App Router) + React 19        |
| Estilização | Tailwind CSS 4                            |
| Testes      | Jest (unitários, backend)                 |
| Infra local | Docker Compose                            |
| Orquestração| Kubernetes (Kind)                         |
| Observação  | Prometheus + Grafana                      |
| CI/CD       | GitHub Actions                            |

---

## Rodando localmente

### Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) e Docker Compose
- [Node.js 20+](https://github.com/nvm-sh/nvm)
- [Make](https://www.gnu.org/software/make/)

### Variáveis de ambiente

```bash
cp api/.env.example api/.env   # edite com seus valores
```

### Subindo tudo (recomendado)

```bash
make dev     # sobe infraestrutura + API + App via Docker (hot reload)
make stop    # para e remove todos os containers
make logs    # acompanha os logs em tempo real
```

### Desenvolvimento local (sem Docker para o código)

```bash
make infra   # sobe postgres + prometheus + grafana em background

cd api && npm install && npm run dev   # API em http://localhost:3333
cd app && npm install && npm run dev   # App em http://localhost:3000
```

### Comandos adicionais

```bash
make infra   # só postgres + prometheus + grafana
make api     # infra + API
make app     # infra + API + App
```

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

## Documentação

Cada subprojeto tem seu próprio README com detalhes de arquitetura, padrões e decisões:

- **[`api/README.md`](api/README.md)** — rotas, arquitetura Clean + DDD, padrões implementados, variáveis de ambiente, testes, observabilidade
- **[`app/README.md`](app/README.md)** — estrutura de pastas, features React 19 / Next.js App Router, error handling, swipe gesture, toast, Server Actions

---

## CI/CD

| Workflow          | Trigger | O que faz                                              |
|-------------------|---------|--------------------------------------------------------|
| `checks.yml`      | PR      | lint, format:check e testes unitários da API           |
| `validate-pr.yml` | PR      | valida título (`feat/fix/chore/docs/test:`), assignee e label |

---

## Infraestrutura

Os manifestos Kubernetes em [`k8s/`](k8s/) rodam num cluster local com [Kind](https://kind.sigs.k8s.io/). Ver [`kind-config.yaml`](kind-config.yaml) para a configuração do cluster.

---

<p align="center">
  Desenvolvido por <strong>Luiz Eduardo Veltroni</strong> ·
  <a href="https://github.com/EduardooPV">GitHub</a> ·
  <a href="https://www.linkedin.com/in/luiz-veltroni/">LinkedIn</a>
</p>
