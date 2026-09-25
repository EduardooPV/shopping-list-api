import { IncomingMessage, ServerResponse } from 'http';
import jsonwebtoken from 'jsonwebtoken';
import { env } from 'shared/utils/env';
import { AuthHelper } from 'shared/utils/get-bearer-token';
import { MissingAuthHeader } from 'modules/auth/domain/errors/missing-auth-header';
import { InvalidAccessToken } from 'modules/auth/domain/errors/invalid-access-token';

export class EnsureAuthenticatedMiddleware {
  static handle(
    req: IncomingMessage & { userId?: string },
    _res: ServerResponse,
    next: () => void,
  ): void {
    const token = AuthHelper.getBearerToken(req.headers.authorization);

    if (token == null) throw new MissingAuthHeader();

    try {
      const { sub } = jsonwebtoken.verify(token, env.secretJwt) as { sub: string };
      req.userId = sub;
      next();
    } catch (error) {
      const name = (error as Error).name;
      if (name === 'TokenExpiredError') throw new InvalidAccessToken({ reason: 'expired' });
      if (name === 'JsonWebTokenError') throw new InvalidAccessToken({ reason: 'signature' });
      throw new InvalidAccessToken();
    }
  }
}
