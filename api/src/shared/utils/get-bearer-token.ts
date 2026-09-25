export class AuthHelper {
  public static getBearerToken(authorizationHeader?: string): string | null {
    if (authorizationHeader == null) {
      return null;
    }

    const [scheme, token] = authorizationHeader.split(/\s+/);

    if (!/^Bearer$/i.test(scheme) || !token) {
      return null;
    }

    return token;
  }
}
