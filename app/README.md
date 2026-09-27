<h1 align="center">Shopping List — App</h1>

<p align="center">
  Frontend mobile-first da aplicação de lista de compras, construído com Next.js App Router e React 19.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
</p>

---

## Sobre o projeto

Frontend de um gerenciador de listas de compras. O usuário cria conta, monta listas, adiciona itens com nome, quantidade e valor, marca itens como concluídos via swipe ou checkbox, e acompanha o progresso por uma barra no topo da lista.

Projeto de estudo focado em funcionalidades modernas do React 19 e do Next.js App Router: Server Components, Server Actions, Streaming com `loading.tsx`, Error Boundaries, e padrões de UX mobile como bottom sheets, gestos de swipe e toast notifications.

---

## Stack

| Camada      | Tecnologia                          |
|-------------|-------------------------------------|
| Framework   | Next.js 16 (App Router)             |
| UI          | React 19                            |
| Estilização | Tailwind CSS 4 (`@theme inline`)    |
| Linguagem   | TypeScript 5 (strict)               |
| Ícones      | Lucide React                        |

---

## Rodando localmente

```bash
npm install
npm run dev   # http://localhost:3000
```

Ou pela raiz do monorepo:

```bash
make dev   # sobe postgres + API + App via Docker
```

---

## Variáveis de ambiente

| Variável    | Descrição                                         |
|-------------|---------------------------------------------------|
| `API_URL`   | URL base da API (ex: `http://localhost:3333`)     |

---

## Estrutura

```
app/
├── app/
│   ├── (auth)/             # Rotas públicas (login, cadastro)
│   │   ├── login/
│   │   └── register/
│   ├── (app)/              # Rotas autenticadas (home, lista, perfil)
│   │   ├── _components/    # HomeClient, ListItem (home page)
│   │   ├── list/[id]/
│   │   │   ├── _components/  # HomeList, ItemListItem, ItemFormSheet
│   │   │   ├── page.tsx
│   │   │   ├── loading.tsx
│   │   │   ├── error.tsx
│   │   │   └── not-found.tsx
│   │   ├── profile/
│   │   │   ├── _components/  # ProfileClient, ProfileForm
│   │   │   ├── page.tsx
│   │   │   ├── loading.tsx
│   │   │   └── error.tsx
│   │   ├── page.tsx
│   │   ├── layout.tsx      # Injeta ToastProvider
│   │   ├── loading.tsx
│   │   └── error.tsx
│   ├── actions/            # Server Actions (auth, users, shopping, item)
│   ├── api/session/        # Route handler para limpar sessão
│   ├── lib/
│   │   ├── api.ts          # Fetch wrapper com cookie de auth
│   │   └── error-messages.ts  # Mapa de erros + parseApiError
│   ├── globals.css         # Tokens de cor + keyframes de animação
│   ├── layout.tsx
│   └── not-found.tsx
└── components/             # Componentes reutilizáveis
    ├── button.tsx
    ├── form-field.tsx
    ├── confirm-dialog.tsx
    ├── logo.tsx
    └── toast.tsx
```

---

## Features React / Next.js implementadas

### Server Components & Data Fetching
Páginas como `page.tsx` são Server Components que fazem fetch diretamente no servidor, sem `useEffect`. O cookie de autenticação (`accessToken`) é lido via `cookies()` do Next.js antes de cada request.

```tsx
// app/(app)/page.tsx
export default async function HomePage() {
  const [listsRes, userRes] = await Promise.all([
    api.get('/shopping-lists'),
    api.get('/users/me'),
  ]);
  if (listsRes.status === 401) redirect('/api/session/clear');
  // ...
}
```

### Server Actions
Toda mutação (criar, editar, deletar) usa Server Actions (`"use server"`). O fluxo é: Client Component → Server Action → API backend → revalidação via `router.refresh()`.

```ts
// app/actions/shopping-list.ts
'use server';
export async function createListAction(name: string): Promise<{ error?: string }> {
  try {
    const response = await api.post('/shopping-lists', { name });
    if (!response.ok) return { error: await parseApiError(response) };
    return {};
  } catch {
    return { error: 'Sem conexão com o servidor.' };
  }
}
```

### Streaming com `loading.tsx`
Cada segmento de rota tem seu `loading.tsx` com skeleton específico. O Next.js exibe o skeleton enquanto o Server Component carrega, sem bloquear toda a página.

### Error Boundaries
`error.tsx` captura erros de runtime (exceções nos Server Components ou Actions). Diferenciação de comportamento:
- **401** → redirect para `/api/session/clear` (limpa cookie e vai para `/login`)
- **404** → `notFound()` exibe `not-found.tsx`
- **Outros** → `throw new Error(...)` exibe `error.tsx` com botão "Tentar novamente"

### Toast / Snackbar
Sistema de toast global implementado manualmente com React Context. Erros de servidor (após submit de formulário) são exibidos como toast no topo + sheet fechado. Erros de validação do cliente permanecem inline no campo.

```tsx
// components/toast.tsx
export function useToast() { return useContext(ToastContext); }
// uso:
const { showToast } = useToast();
showToast('Não foi possível salvar.', 'error');
```

### Swipe Gesture (sem biblioteca)
Itens da lista aceitam swipe horizontal com Pointer Events nativos:
- **Swipe direito** → conclui (ou reabre) o item com fundo verde/âmbar
- **Swipe esquerdo** → deleta o item com fundo vermelho

```tsx
onPointerDown={handlePointerDown}
onPointerMove={handlePointerMove}
onPointerUp={handlePointerUp}
// touchAction: "none" no elemento para não disputar com o scroll
```

### Bottom Sheet
Formulários de criação/edição usam um bottom sheet com animação CSS:
```css
transform: translateY(100%) → translateY(0)
transition: cubic-bezier(0.32, 0.72, 0, 1) 320ms
```

### useTransition + pendingIds
Toggle de item (concluir/reabrir) não usa otimismo — o item fica com spinner visível no checkbox enquanto a requisição está em andamento:

```tsx
const [pendingToggleIds, setPendingToggleIds] = useState<Set<string>>(new Set());
// Adiciona ID ao set → exibe spinner → remove ao concluir
```

### Formatação de moeda
Campo de valor no formulário usa máscara de entrada que exibe `R$ X,XX` enquanto o usuário digita, convertendo para `float` antes de enviar ao servidor.

---

## Tratamento de erro padronizado

`parseApiError(response)` nunca expõe strings brutas do backend. Usa um mapa de códigos de erro:

```ts
const errorMessages = {
  INVALID_CREDENTIALS: 'E-mail ou senha incorretos',
  USER_ALREADY_EXISTS: 'Este e-mail já está em uso',
  LIST_NOT_FOUND: 'Lista não encontrada',
  // ...
};
```

Se o código não estiver mapeado, cai no fallback por status HTTP:
- `400` → "Não foi possível completar a ação. Tente novamente."
- `401` → "Sessão inválida. Faça login novamente."
- `≥500` → "Erro no servidor. Tente novamente mais tarde."
- Exceção de rede → "Sem conexão com o servidor. Verifique sua internet."

---

## Autenticação

- O access token JWT é armazenado como cookie `accessToken` (não HttpOnly, lido pelo middleware Next.js)
- O refresh token fica como cookie HttpOnly definido pelo backend
- O middleware (`middleware.ts`) bloqueia rotas autenticadas e redireciona rotas públicas quando já logado
- `/api/session/clear` é um Route Handler que deleta o cookie e redireciona para `/login`

---

## Documentação adicional

- [`docs/FRONTEND.md`](../docs/FRONTEND.md) — mapeamento completo de telas e rotas da API consumidas
- [`docs/REACT_NEXTJS_FEATURES.md`](../docs/REACT_NEXTJS_FEATURES.md) — guia das features React/Next.js usadas no projeto
- **Backend** → [`api/README.md`](../api/README.md)

---

<p align="center">
  Desenvolvido por <strong>Luiz Eduardo Veltroni</strong> ·
  <a href="https://github.com/EduardooPV">GitHub</a> ·
  <a href="https://www.linkedin.com/in/luiz-veltroni/">LinkedIn</a>
</p>
