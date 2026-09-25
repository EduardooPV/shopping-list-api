# React & Next.js — Features do Projeto

Mapeamento de todas as features modernas que vamos usar, onde cada uma aparece e o tradeoff de cada escolha.
Serve como guia de aprendizado gradual — do mais simples ao mais avançado.

---

## Visão geral do projeto frontend

```
App Router (Next.js 15)
├── (auth)/
│   ├── login/          → tela de login
│   └── register/       → tela de cadastro
├── (app)/
│   ├── layout.tsx      → layout autenticado (header com nome + avatar)
│   ├── page.tsx        → home — lista de shopping lists
│   └── lists/[id]/
│       └── page.tsx    → detalhe de uma lista (itens)
└── middleware.ts        → protege rotas autenticadas
```

---

## Parte 1 — Next.js App Router: o que muda tudo

### Server Components vs Client Components

O App Router inverte o default: **todo componente é Server Component por padrão**.
Só vira Client Component quando você coloca `"use client"` no topo.

```
Server Component                     Client Component
─────────────────────────────────    ─────────────────────────────────
Roda no servidor, zero JS no bundle  Roda no browser, pode ter estado
Pode fazer fetch / acesso ao banco   Pode usar useState, useEffect, etc.
Não pode usar hooks React            Pode usar event handlers (onClick)
Não pode acessar browser APIs        Pode acessar localStorage, window
```

**Regra prática:** vai do servidor para o cliente. O mínimo possível de Client Components.

**No projeto:**
- `page.tsx` da home busca as listas no servidor → Server Component
- O card de cada lista com botão De/Edit e swipe → Client Component
- O modal de criar/editar → Client Component
- O header com nome do usuário → pode ser Server Component (recebe os dados via prop)

**Tradeoff:** Server Components reduzem o JS enviado ao browser e são mais rápidos no carregamento inicial, mas qualquer interatividade exige Client Component. Não tente colocar `useState` em Server Component — vai dar erro em runtime.

---

### Server Actions

Funções assíncronas marcadas com `"use server"` que rodam no servidor e podem ser chamadas direto de Client Components ou formulários.

```ts
// actions/auth.ts
"use server"

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  // chama a API, seta cookie, redireciona
}
```

```tsx
// no formulário de login
<form action={loginAction}>
  <input name="email" />
  <input name="password" type="password" />
  <button type="submit">Entrar</button>
</form>
```

**No projeto:** criação/edição/deleção de listas e itens, login, logout, cadastro.

**Tradeoff:** Server Actions simplificam muito o padrão — sem precisar de `fetch` manual no cliente e sem API Route separada. O tradeoff é que o código roda no servidor (sem acesso direto ao estado do React) e o feedback de loading/erro precisa ser capturado via `useActionState` ou `useFormStatus`.

---

### Middleware

Arquivo `middleware.ts` na raiz que intercepta requisições antes de chegar às páginas.

```ts
// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")
  if (!token && request.nextUrl.pathname.startsWith("/")) {
    return NextResponse.redirect(new URL("/login", request.url))
  }
}
```

**No projeto:** redireciona para `/login` se não tiver token. Protege todas as rotas dentro de `(app)/`.

**Tradeoff:** middleware roda no Edge Runtime (sem Node.js APIs), então nada de Prisma ou bcrypt aqui. Só leitura de cookies/headers e redirecionamentos.

---

### Route Groups

Pastas com `()` no nome não criam segmento de URL — servem só para organizar layouts.

```
(auth)/login       → URL: /login
(app)/page.tsx     → URL: /
(app)/lists/[id]   → URL: /lists/abc123
```

**No projeto:** `(auth)` tem layout sem header (só o formulário). `(app)` tem layout com o header "Olá [nome], bem vindo".

---

### Intercepting Routes

Permite renderizar uma rota dentro do contexto de outra, sem navegar. Perfeito para modais com URL própria.

```
(app)/
├── @modal/
│   └── lists/
│       └── new/
│           └── page.tsx   ← modal de criar lista
└── layout.tsx             ← recebe o slot @modal
```

**No projeto:** os modais de criar lista, editar lista, confirmar deleção poderiam usar intercepting routes — assim a URL muda (`.../lists/new`) e o modal aparece sobre a home, sem sair da tela.

**Tradeoff:** é poderoso mas mais complexo de configurar. Começa sem isso e adiciona se quiser deep links para os modais.

---

### Loading e Error boundaries por rota

```
(app)/
├── page.tsx
├── loading.tsx   ← skeleton automático enquanto page.tsx carrega
└── error.tsx     ← tela de erro se page.tsx lançar exceção
```

`loading.tsx` é exibido automaticamente pelo Next.js enquanto o Server Component faz o fetch. Não precisa de nenhum estado de loading manual.

---

### `revalidatePath` / `revalidateTag`

Depois de uma Server Action que muta dados, invalida o cache para o Next.js rebuscar.

```ts
"use server"
export async function deleteList(listId: string) {
  await api.delete(`/lists/${listId}`)
  revalidatePath("/")   // refaz o fetch da home
}
```

**No projeto:** toda mutação (criar/editar/deletar lista ou item) chama `revalidatePath` para atualizar a listagem.

---

## Parte 2 — React Hooks modernos

### `useActionState` (React 19) — substitui o padrão manual de form

O hook mais importante para formulários. Recebe uma action e devolve o estado atual (pending, error, data) e a action wrappada.

```tsx
"use client"
import { useActionState } from "react"
import { loginAction } from "@/actions/auth"

export function LoginForm() {
  const [state, action, isPending] = useActionState(loginAction, null)

  return (
    <form action={action}>
      <input name="email" />
      <input name="password" type="password" />
      {state?.error && <p>{state.error}</p>}
      <button disabled={isPending}>
        {isPending ? "Entrando..." : "Entrar"}
      </button>
    </form>
  )
}
```

**No projeto:** formulário de login, cadastro, criação e edição de lista, edição de perfil.

**Tradeoff vs useState manual:** antes você precisava de `useState` para `isLoading`, `error`, `data` — agora é tudo num hook. A action ainda precisa retornar um objeto `{ error? }` em vez de lançar exceção para o estado de erro funcionar.

---

### `useFormStatus` (React 19) — estado do form em componentes filhos

Permite que um componente filho saiba se o formulário pai está pendente, sem prop drilling.

```tsx
"use client"
import { useFormStatus } from "react-dom"

export function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Carregando..." : label}
    </button>
  )
}
```

**No projeto:** botão de submit reutilizável para os formulários de login, cadastro e modais.

**Tradeoff:** só funciona dentro de um `<form>`. Componente filho, não pai. Não precisa passar `isLoading` como prop.

---

### `useOptimistic` (React 19) — UI antes da resposta da API

Atualiza a UI imediatamente e reverte se a action falhar.

```tsx
const [optimisticLists, addOptimistic] = useOptimistic(
  lists,
  (current, listToDelete: string) =>
    current.filter((l) => l.id !== listToDelete)
)

async function handleDelete(listId: string) {
  addOptimistic(listId)   // remove da UI na hora
  await deleteListAction(listId)   // chama a API
  // se falhar, reverte automaticamente
}
```

**No projeto:**
- Deletar lista → some da tela imediatamente
- Marcar item como concluído (swipe direita) → risco no nome aparece na hora
- Deletar item (swipe esquerda) → some da tela na hora

**Tradeoff:** UX muito mais responsiva. O risco é o estado ficar inconsistente se a API falhar — garanta feedback visual de erro para o usuário saber que reverteu.

---

### `useTransition` — marca atualizações como não urgentes

Envolve atualizações que podem esperar (filtros, buscas, paginação) sem bloquear interações urgentes (digitação, clique).

```tsx
const [isPending, startTransition] = useTransition()

function handlePageChange(page: number) {
  startTransition(() => {
    setCurrentPage(page)   // não urgente — pode aguardar
  })
}
```

**No projeto:** paginação das listas, qualquer filtro futuro.

**Tradeoff vs setImmediate/setTimeout:** `startTransition` é integrado ao React Scheduler — o React sabe que pode interromper essa atualização se vier algo mais urgente (como o usuário digitar). Não é um hack de performance, é semântica.

---

### `useDeferredValue` — versão "atrasada" de um valor

Parecido com `useTransition` mas para valores derivados. Enquanto o valor "real" atualiza, você mostra o valor anterior sem travar a UI.

```tsx
const deferredSearch = useDeferredValue(searchTerm)

const filteredLists = useMemo(
  () => lists.filter((l) => l.name.includes(deferredSearch)),
  [lists, deferredSearch]
)
```

**No projeto:** se adicionar busca de listas ou itens, `useDeferredValue` mantém a lista anterior visível enquanto filtra.

**Tradeoff vs debounce:** `useDeferredValue` é controlado pelo React (não por `setTimeout`), então respeita o scheduler. Mas debounce reduz chamadas à API — para busca que vai ao servidor, use debounce. Para filtragem local, use `useDeferredValue`.

---

### `useMemo` — memoriza resultado de cálculo caro

Recalcula só quando as dependências mudam.

```tsx
const totalPrice = useMemo(
  () => items.reduce((sum, item) => sum + item.quantity * item.amount, 0),
  [items]
)
```

**No projeto:** `TotalPrice` do rodapé na tela de itens — recalcular a cada re-render seria desperdício.

**Tradeoff:** `useMemo` tem custo próprio (armazenar resultado + comparar deps). Para cálculos simples (`items.length`, uma soma de 3 itens), o custo é maior que o benefício. Use quando: o cálculo é genuinamente caro (muitos itens) ou o valor é passado para um componente filho que usa `memo`.

---

### `useCallback` — memoriza função para não mudar referência

```tsx
const handleDelete = useCallback(
  (listId: string) => {
    startTransition(() => deleteList(listId))
  },
  [deleteList]
)
```

**No projeto:** callbacks passados para componentes filhos memorizados com `memo` (ex: o card de cada lista).

**Tradeoff:** igual ao `useMemo`. Só faz diferença se o componente filho for wrapped com `memo`. Se não for, `useCallback` não ajuda nada e adiciona overhead.

---

### `useReducer` — máquina de estado para lógica complexa

Quando o estado tem múltiplas sub-partes que mudam juntas, `useReducer` é mais legível que vários `useState`.

```tsx
type ModalState =
  | { type: "closed" }
  | { type: "create" }
  | { type: "edit"; list: ShoppingList }
  | { type: "delete"; listId: string }

type ModalAction =
  | { type: "OPEN_CREATE" }
  | { type: "OPEN_EDIT"; list: ShoppingList }
  | { type: "OPEN_DELETE"; listId: string }
  | { type: "CLOSE" }

function modalReducer(state: ModalState, action: ModalAction): ModalState {
  switch (action.type) {
    case "OPEN_CREATE": return { type: "create" }
    case "OPEN_EDIT":   return { type: "edit", list: action.list }
    case "OPEN_DELETE": return { type: "delete", listId: action.listId }
    case "CLOSE":       return { type: "closed" }
  }
}

const [modal, dispatch] = useReducer(modalReducer, { type: "closed" })
```

**No projeto:** controle dos modais da home (criar lista, editar lista, confirmar deleção). Também o modal de excluir conta no perfil.

**Tradeoff:** mais verboso que `useState`, mas o switch torna impossível chegar a estados inválidos (ex: modal de "edit" sem lista associada). Excelente para lógica de UI com múltiplas transições.

---

### `useRef` — valor mutável sem re-render

Dois usos distintos:

**1. Referência a elemento DOM:**
```tsx
const inputRef = useRef<HTMLInputElement>(null)

useEffect(() => {
  inputRef.current?.focus()   // foca o campo ao abrir modal
}, [isOpen])
```

**2. Valor mutável que não dispara re-render:**
```tsx
const swipeStartX = useRef(0)   // posição inicial do swipe — não precisa de render

function handleTouchStart(e: TouchEvent) {
  swipeStartX.current = e.touches[0].clientX
}
```

**No projeto:**
- Focus automático no input ao abrir modais
- Tracking de posição do swipe nos itens/listas
- Guardar o timer de debounce

---

### `useId` — IDs acessíveis e únicos

Gera IDs únicos por instância do componente, seguros para SSR (servidor e cliente geram o mesmo ID).

```tsx
function FormField({ label }: { label: string }) {
  const id = useId()
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} />
    </div>
  )
}
```

**No projeto:** todos os campos de formulário — nunca hardcode `id="email"` num componente reutilizável.

**Tradeoff vs Math.random():** `Math.random()` no render causa hydration mismatch (servidor e cliente geram valores diferentes). `useId` é determinístico.

---

### `use()` hook (React 19) — consume Promise e Context no render

Pode suspender um componente aguardando uma Promise, e pode ler Context (inclusive dentro de condicionais).

```tsx
// lendo context com use() — pode ser condicional
const theme = use(ThemeContext)

// consumindo promise que vem de Server Component
function UserAvatar({ userPromise }: { userPromise: Promise<User> }) {
  const user = use(userPromise)   // suspende até resolver
  return <Avatar name={user.name} />
}
```

**No projeto:** passar data fetched no servidor para Client Components sem serializar tudo via props.

**Tradeoff:** `use()` com Promise precisa de `<Suspense>` acima. Mais elegante que `useEffect` + `useState` para dados assíncronos em Client Components.

---

### `memo` — evita re-render de componentes filhos

```tsx
const ListCard = memo(function ListCard({ list, onEdit, onDelete }: Props) {
  return (...)
})
```

**No projeto:** `ListCard` e `ItemRow` — a lista pode ter muitos cards e só o card alterado deve re-renderizar.

**Tradeoff:** `memo` só evita re-render se todas as props forem iguais por referência. Por isso `useCallback` e `useMemo` nas props de função/objeto. Se você usa `memo` sem estabilizar as props, ele não vai servir de nada.

---

## Parte 3 — Padrões de organização

### Custom Hooks — extraindo lógica reutilizável

Qualquer composição de hooks pode virar um custom hook com prefixo `use`.

```tsx
// hooks/useSwipe.ts
export function useSwipe(onSwipeLeft: () => void, onSwipeRight: () => void) {
  const startX = useRef(0)

  const handleTouchStart = useCallback((e: TouchEvent) => {
    startX.current = e.touches[0].clientX
  }, [])

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    const delta = e.changedTouches[0].clientX - startX.current
    if (delta < -80) onSwipeLeft()
    if (delta > 80) onSwipeRight()
  }, [onSwipeLeft, onSwipeRight])

  return { handleTouchStart, handleTouchEnd }
}
```

**No projeto:**
- `useSwipe` — gesture de swipe nos itens e listas
- `useAuth` — lê o token, faz refresh automático
- `useDebounce` — para buscas futuras

---

### Estrutura de pastas sugerida

```
shopping-list-frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (app)/
│   │   ├── layout.tsx        ← header autenticado (Server Component)
│   │   ├── page.tsx          ← home: busca listas (Server Component)
│   │   └── lists/[id]/
│   │       └── page.tsx      ← detalhe: busca itens (Server Component)
│   ├── layout.tsx            ← root layout
│   └── middleware.ts
├── actions/
│   ├── auth.ts               ← loginAction, registerAction, logoutAction
│   ├── lists.ts              ← createList, updateList, deleteList
│   └── items.ts              ← createItem, updateItem, deleteItem
├── components/
│   ├── ui/                   ← Button, Input, Modal, Avatar (primitivos)
│   └── lists/                ← ListCard, ListModal, DeleteConfirm
│   └── items/                ← ItemRow, ItemModal
├── hooks/
│   ├── useSwipe.ts
│   └── useDebounce.ts
├── lib/
│   └── api.ts                ← fetch wrapper com token e refresh
└── types/
    └── index.ts
```

---

## Parte 4 — Mapa de features por tela

| Tela | Server Component | Hooks | Features Next.js |
|------|-----------------|-------|-----------------|
| Login | ❌ (form interativo) | `useActionState`, `useFormStatus` | Server Actions, middleware redirect |
| Cadastro | ❌ | `useActionState`, `useFormStatus` | Server Actions |
| Home (listas) | ✅ (fetch inicial) | `useOptimistic`, `useReducer`, `useTransition`, `useCallback`, `memo` | `revalidatePath`, `loading.tsx`, Route Groups |
| Detalhe (itens) | ✅ (fetch inicial) | `useOptimistic`, `useMemo`, `useRef`, `useSwipe` | `revalidatePath`, `loading.tsx` |
| Perfil | ✅ (GET /users/me) | `useActionState`, `useReducer` (modal delete) | Server Actions, `revalidatePath` |

---

## Parte 5 — O que NÃO vamos usar e por quê

| Feature | Por quê não |
|---------|-------------|
| `useContext` para auth global | Server Components não acessam Context. O token fica no cookie HttpOnly — o middleware lê no servidor. Não precisa de contexto global de auth. |
| `useEffect` para fetch de dados | Server Components resolvem isso. `useEffect` + fetch é o padrão antigo do Pages Router. |
| Redux / Zustand | Estado de servidor (listas, itens, perfil) fica no servidor via Server Components + `revalidatePath`. Estado de UI (modal aberto, swipe) fica local com `useReducer`. Não há estado global suficiente para justificar uma lib. |
| `getServerSideProps` / `getStaticProps` | Pages Router. No App Router é só `async function Page()` mesmo. |

---

## Ordem de implementação (gradual)

```
Step 1 — Auth
  → Server Actions + useActionState + useFormStatus
  → middleware de proteção de rota

Step 2 — Home / Listas
  → Server Component com fetch
  → useOptimistic (delete)
  → useReducer (modais)
  → loading.tsx

Step 3 — Itens
  → useOptimistic (swipe complete)
  → useMemo (total price)
  → useRef + custom hook useSwipe

Step 4 — Perfil
  → useActionState (editar)
  → useReducer (modal de confirmação delete conta)

Step 5 — Polimento
  → memo + useCallback nos cards
  → useTransition na paginação
  → useDeferredValue se adicionar busca
```
