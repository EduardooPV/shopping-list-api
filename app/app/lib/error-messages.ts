const errorMessages: Record<string, string> = {
  // Auth
  INVALID_CREDENTIALS: "E-mail ou senha incorretos",
  INVALID_ACCESS_TOKEN: "Sessão inválida, faça login novamente",
  INVALID_REFRESH_TOKEN: "Sessão expirada, faça login novamente",
  MISSING_AUTH_HEADER: "Autenticação necessária",

  // Usuário
  USER_ALREADY_EXISTS: "Este e-mail já está em uso",
  USER_NOT_FOUND: "Usuário não encontrado",
  INVALID_USER_ID: "ID de usuário inválido",
  INVALID_USER_NAME: "Nome inválido",

  // Listas
  LIST_NOT_FOUND: "Lista não encontrada",
  INVALID_LIST_ID: "ID de lista inválido",
  INVALID_LIST_NAME: "Nome de lista inválido",
  INVALID_SHOPPING_LIST_ID: "ID de lista inválido",

  // Itens
  ITEM_NOT_FOUND: "Item não encontrado",
  INVALID_ITEM_ID: "ID de item inválido",
  INVALID_ITEM_NAME: "Nome de item inválido",

  // Genéricos
  VALIDATION_ERROR: "Dados inválidos, verifique os campos",
  BAD_REQUEST: "Dados inválidos",
  INTERNAL_ERROR: "Erro no servidor. Tente novamente mais tarde.",
};

function messageForStatus(status: number): string {
  if (status === 400) return "Não foi possível completar a ação. Tente novamente.";
  if (status === 401) return "Sessão inválida. Faça login novamente.";
  if (status === 403) return "Sem permissão para realizar esta ação.";
  if (status === 404) return "Recurso não encontrado.";
  if (status === 409) return "Conflito com um registro existente.";
  if (status >= 500) return "Erro no servidor. Tente novamente mais tarde.";
  return "Algo deu errado. Tente novamente.";
}

export function getErrorMessage(code?: string): string {
  if (code && errorMessages[code]) return errorMessages[code];
  return "Algo deu errado. Tente novamente.";
}

export async function parseApiError(response: Response): Promise<string> {
  try {
    const data = await response.json();
    const code = data?.error?.code as string | undefined;
    if (code && errorMessages[code]) return errorMessages[code];
  } catch {
    // Response body wasn't JSON (e.g. proxy HTML 502) — fall through to status
  }
  return messageForStatus(response.status);
}
