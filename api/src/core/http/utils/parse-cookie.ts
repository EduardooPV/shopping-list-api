class CookieParser {
  static parse(cookieHeader?: string): Record<string, string> {
    if (cookieHeader == null) return {};

    return cookieHeader
      .split(';')
      .map((cookie) => cookie.trim())
      .filter((cookie) => cookie.length > 0)
      .reduce(
        (acc, cookie) => {
          const [name, ...rest] = cookie.split('=');
          acc[name] = decodeURIComponent(rest.join('='));
          return acc;
        },
        {} as Record<string, string>,
      );
  }
}

export { CookieParser };
