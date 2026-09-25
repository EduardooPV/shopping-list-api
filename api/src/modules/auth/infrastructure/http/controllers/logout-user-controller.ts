import { IncomingMessage, ServerResponse } from 'http';
import { LogoutUserUseCase } from 'modules/auth/application/logout-user/logout-user-use-case';
import { CookieParser } from 'core/http/utils/parse-cookie';
import { env } from 'shared/utils/env';
import { InvalidRefreshToken } from 'modules/auth/domain/errors/invalid-refresh-token';
import { CookieSerializer } from 'core/http/utils/cookies';
import { ReplyResponder } from 'core/http/utils/reply';

class LogoutUserController {
  constructor(private logoutUseCase: LogoutUserUseCase) {}

  async handle(request: IncomingMessage, response: ServerResponse): Promise<void> {
    const { refreshToken } = CookieParser.parse(request.headers.cookie);

    if (!refreshToken) throw new InvalidRefreshToken();

    await this.logoutUseCase.execute(refreshToken);

    const cookie = CookieSerializer.serialize('refreshToken', '', {
      httpOnly: true,
      secure: env.nodeEnv === 'production',
      path: '/',
      sameSite: 'Strict',
      maxAge: 0,
    });

    response.setHeader('Set-Cookie', cookie);
    new ReplyResponder(response).noContent();
  }
}

export { LogoutUserController };
