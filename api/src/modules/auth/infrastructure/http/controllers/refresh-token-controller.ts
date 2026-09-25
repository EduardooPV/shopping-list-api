import { IncomingMessage, ServerResponse } from 'http';
import { RefreshTokenUseCase } from 'modules/auth/application/refresh-token/refresh-token-use-case';
import { CookieParser } from 'core/http/utils/parse-cookie';
import { InvalidRefreshToken } from 'modules/auth/domain/errors/invalid-refresh-token';
import { CookieSerializer } from 'core/http/utils/cookies';
import { env } from 'shared/utils/env';
import { ReplyResponder } from 'core/http/utils/reply';
import { REFRESH_TOKEN_MAX_AGE_SECONDS } from 'shared/constants/auth';

class RefreshTokenController {
  constructor(private refreshTokenUseCase: RefreshTokenUseCase) {}

  async handle(request: IncomingMessage, response: ServerResponse): Promise<void> {
    const { refreshToken } = CookieParser.parse(request.headers.cookie);

    if (!refreshToken) {
      throw new InvalidRefreshToken();
    }

    const { accessToken, refreshToken: newRefresh } =
      await this.refreshTokenUseCase.execute(refreshToken);

    const cookie = CookieSerializer.serialize('refreshToken', newRefresh, {
      httpOnly: true,
      secure: env.nodeEnv === 'production',
      path: '/',
      sameSite: 'Strict',
      maxAge: REFRESH_TOKEN_MAX_AGE_SECONDS,
    });

    response.setHeader('Set-Cookie', cookie);
    new ReplyResponder(response).ok({ message: 'Token refreshed successfully', accessToken });
  }
}

export { RefreshTokenController };
