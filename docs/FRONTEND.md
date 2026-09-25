# Guia de desenvolvimento do frontend

Mapeamento gradual das telas e funcionalidades com base nos wireframes.
Cada step tem as rotas do backend que ele consome.

---

## Step 1 — Autenticação ✅ (backend pronto)

**Telas:** login · cadastro

| Ação | Rota |
|---|---|
| Criar conta | `POST /users` |
| Login | `POST /auth/login` → retorna `accessToken` + cookie `refreshToken` |
| Renovar token | `POST /auth/refresh` → usar quando access token expirar |
| Logout | `POST /auth/logout` |

**O que fazer no front:**
- [ ] Tela de login (email + senha + botão "Entrar" + link "Criar conta")
- [ ] Tela de cadastro (email + senha + confirmar senha + botão "Criar conta")
- [ ] Guardar o `accessToken` (memória ou localStorage) e enviar em todo request autenticado via `Authorization: Bearer <token>`
- [ ] Interceptor que detecta 401 e chama `/auth/refresh` automaticamente antes de repetir o request

---

## Step 2 — Perfil do usuário ✅ (backend pronto)

**Tela:** perfil (`GET /users/me`)

| Ação | Rota |
|---|---|
| Buscar dados do usuário logado | `GET /users` |
| Editar nome e senha | `PUT /users` → body: `{ name, password }` |
| Excluir conta | `DELETE /users` |

**O que fazer no front:**
- [ ] Tela de perfil mostrando nome e email
- [ ] Botão "Editar perfil" → formulário com nome + senha + confirmar senha
- [ ] Botão "Excluir conta" → modal de confirmação ("Confirmar" / "Cancelar")
- [ ] Botão "Sair" → chama logout e redireciona para login

---

## Step 3 — Listas de compras ✅ (backend pronto)

**Tela:** home com lista de listas (`GET /lists`)

| Ação | Rota |
|---|---|
| Listar listas (paginado) | `GET /lists?page=1&per_page=10` |
| Criar lista | `POST /lists` → body: `{ name }` |
| Editar nome da lista | `PUT /lists/:id` → body: `{ name }` |
| Apagar lista | `DELETE /lists/:id` |

**O que fazer no front:**
- [ ] Tela home: saudação com nome do usuário + avatar com inicial + listagem das listas
- [ ] Botão `+` para abrir modal de criação (campo "Nome lista" + "Criar" / "Cancelar")
- [ ] Swipe ou botão `⋯` em cada card para revelar "Del" e "Edit"
- [ ] "Edit" abre o mesmo modal com o nome atual preenchido
- [ ] "Del" abre modal de confirmação ("Apagar" / "Cancelar")
- [ ] Paginação ou scroll infinito consumindo `page` e `per_page`

---

## Step 4 — Itens da lista ✅ (backend pronto)

**Tela:** detalhe da lista (`GET /lists/:id/items`)

| Ação | Rota |
|---|---|
| Listar itens | `GET /lists/:listId/items` |
| Criar item | `POST /lists/:listId/items` → body: `{ name, quantity, amount, status }` |
| Marcar como concluído / deletar | `PUT /lists/:listId/items/:itemId` / `DELETE /lists/:listId/items/:itemId` |
| Resumo da lista | `GET /lists/:listId/resume` → retorna `doneItemsCount`, `pendingItemsCount`, `totalAmount` |

**O que fazer no front:**
- [ ] Tela de detalhe: header com nome da lista + botão Del/Edit da própria lista
- [ ] Listagem de itens com nome, Qtd, UnitPrice e TotalPrice
- [ ] Botão `+` para adicionar item (modal: campo "Nome item" + "Criar" / "Cancelar")
- [ ] Swipe para esquerda → deletar item
- [ ] Swipe para direita → marcar item como concluído (risco no nome, status `done`)
- [ ] Rodapé com `TotalPrice` vindo de `totalAmount` do endpoint `/resume`

---

## Observações gerais

- Todos os requests autenticados exigem header `Authorization: Bearer <accessToken>`
- O `refreshToken` chega como cookie `HttpOnly` — o browser o envia automaticamente
- Respostas de erro seguem o padrão `{ code, message }` — use o `code` para mensagens amigáveis
- Validação de campos no backend via Zod — erros retornam HTTP 422 com lista de problemas por campo
