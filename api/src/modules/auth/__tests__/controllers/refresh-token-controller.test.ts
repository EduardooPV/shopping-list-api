// @ts-nocheck
import { IncomingMessage, ServerResponse } from 'http';
import { RefreshTokenController } from '../../infrastructure/http/controllers/refresh-token-controller';
import { RefreshTokenUseCase } from 'modules/auth/application/refresh-token/refresh-token-use-case';
import { CookieParser } from 'core/http/utils/parse-cookie';
import { CookieSerializer } from 'core/http/utils/cookies';
import { ReplyResponder } from 'core/http/utils/reply';
import { InvalidRefreshToken } from 'modules/auth/domain/errors/invalid-refresh-token';
import { env } from 'shared/utils/env';
import { REFRESH_TOKEN_MAX_AGE_SECONDS } from 'shared/constants/auth';

jest.mock('core/http/utils/parse-cookie');
jest.mock('core/http/utils/cookies');
jest.mock('core/http/utils/reply');
jest.mock('shared/utils/env', () => ({
  env: { nodeEnv: 'test' },
}));

describe('RefreshTokenController', () => {
  let refreshTokenUseCase: RefreshTokenUseCase;
  let controller: RefreshTokenController;
  let request: IncomingMessage;
  let response: ServerResponse;

  beforeEach(() => {
    refreshTokenUseCase = { execute: jest.fn() } as unknown;
    controller = new RefreshTokenController(refreshTokenUseCase);
    request = { headers: {} } as IncomingMessage;
    response = { setHeader: jest.fn() } as unknown;
    (ReplyResponder as jest.Mock).mockImplementation(() => ({
      ok: jest.fn(),
    }));
  });

  it('should refresh token successfully and return ok response', async () => {
    (CookieParser.parse as jest.Mock).mockReturnValue({ refreshToken: 'old_token' });
    (refreshTokenUseCase.execute as jest.Mock).mockResolvedValue({
      accessToken: 'new_access',
      refreshToken: 'new_refresh',
    });
    (CookieSerializer.serialize as jest.Mock).mockReturnValue('cookie_value');

    await controller.handle(request, response);

    expect(CookieParser.parse).toHaveBeenCalledWith(undefined);
    expect(refreshTokenUseCase.execute).toHaveBeenCalledWith('old_token');
    expect(CookieSerializer.serialize).toHaveBeenCalledWith('refreshToken', 'new_refresh', {
      httpOnly: true,
      secure: env.nodeEnv === 'production',
      path: '/',
      sameSite: 'Strict',
      maxAge: REFRESH_TOKEN_MAX_AGE_SECONDS,
    });
    expect(response.setHeader).toHaveBeenCalledWith('Set-Cookie', 'cookie_value');
    const replyInstance = (ReplyResponder as jest.Mock).mock.results[0].value;
    expect(replyInstance.ok).toHaveBeenCalledWith({
      message: 'Token refreshed successfully',
      accessToken: 'new_access',
    });
  });

  it('should throw InvalidRefreshToken if cookie is missing', async () => {
    (CookieParser.parse as jest.Mock).mockReturnValue({});

    await expect(controller.handle(request, response)).rejects.toThrow(InvalidRefreshToken);
    expect(refreshTokenUseCase.execute).not.toHaveBeenCalled();
  });
});
