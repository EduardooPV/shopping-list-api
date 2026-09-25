class HttpStatusMapper {
  public static CODE_TO_STATUS: Readonly<Record<string, number>> = {
    // --- Auth ---
    INVALID_ACCESS_TOKEN: 401,
    INVALID_CREDENTIALS: 401,
    INVALID_REFRESH_TOKEN: 401,
    MISSING_AUTH_HEADER: 401,

    // --- Users ---
    INVALID_USER_ID: 400,
    INVALID_USER_NAME: 422,
    USER_ALREADY_EXISTS: 409,
    USER_NOT_FOUND: 404,

    // --- Lists ---
    INVALID_LIST_ID: 400,
    INVALID_LIST_NAME: 422,
    LIST_NOT_FOUND: 404,

    // --- Items ---
    INVALID_ITEM_ID: 400,
    INVALID_SHOPPING_LIST_ID: 400,
    INVALID_ITEM_NAME: 422,
    ITEM_NOT_FOUND: 404,

    // --- Generic ---
    FORBIDDEN: 403,
    BAD_REQUEST: 400,
    VALIDATION_ERROR: 422,
    INTERNAL_ERROR: 500,
  } as const;

  public static getStatusFor(code: string): number {
    return this.CODE_TO_STATUS[code] ?? 400;
  }
}

export { HttpStatusMapper };
