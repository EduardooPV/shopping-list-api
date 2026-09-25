# Shopping List — App

Frontend da aplicação de lista de compras. Projeto de estudo focado em features modernas do React 19 e Next.js com App Router.

## Stack

| Camada      | Tecnologia                  |
|-------------|-----------------------------|
| Framework   | Next.js 16 (App Router)     |
| UI          | React 19                    |
| Estilização | Tailwind CSS 4              |
| Linguagem   | TypeScript 5                |

## Rodando localmente

```bash
npm install
npm run dev   # http://localhost:3000
```

Ou pela raiz do monorepo:

```bash
make dev   # sobe postgres + API + App
```

## Variáveis de ambiente

| Variável              | Descrição                     |
|-----------------------|-------------------------------|
| `NEXT_PUBLIC_API_URL` | URL base da API (ex: `http://localhost:3333`) |

## Estrutura

```
app/
├── app/              # App Router — páginas, layouts, loading, error
│   ├── (auth)/       # Rotas públicas: login, cadastro
│   └── (app)/        # Rotas autenticadas: home, listas, itens, perfil
├── actions/          # Server Actions
├── components/       # Componentes React
├── hooks/            # Custom hooks
├── lib/              # Fetch wrapper, utilitários
└── types/            # Tipos TypeScript compartilhados
```

## Documentação

- [`docs/FRONTEND.md`](../docs/FRONTEND.md) — mapeamento de telas e rotas consumidas
- [`docs/REACT_NEXTJS_FEATURES.md`](../docs/REACT_NEXTJS_FEATURES.md) — guia de features React/Next.js usadas no projeto
