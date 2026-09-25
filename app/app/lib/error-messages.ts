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
  INVALID_USER_NAME: "Nome de usuário inválido",

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
  BAD_REQUEST: "Requisição inválida",
  INTERNAL_ERROR: "Erro interno, tente novamente mais tarde",
};

export function getErrorMessage(code: string, fallback?: string): string {
  return errorMessages[code] ?? fallback ?? "Algo deu errado, tente novamente";
}
