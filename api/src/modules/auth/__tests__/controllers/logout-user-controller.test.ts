// @ts-nocheck
import { LogoutUserController } from '../../infrastructure/http/controllers/logout-user-controller';
import { LogoutUserUseCase } from 'modules/auth/application/logout-user/logout-user-use-case';
import { IncomingMessage, ServerResponse } from 'http';
import { CookieParser } from 'core/http/utils/parse-cookie';
import { CookieSerializer } from 'core/http/utils/cookies';
import { ReplyResponder } from 'core/http/utils/reply';
import { env } from 'shared/utils/env';
import { InvalidRefreshToken } from 'modules/auth/domain/errors/invalid-refresh-token';

jest.mock('core/http/utils/parse-cookie');
jest.mock('core/http/utils/cookies');
jest.mock('core/http/utils/reply');

const mockResponse: ServerResponse = {
  setHeader: jest.fn(),
  end: jest.fn(),
} as unknown;

const mockRequest: IncomingMessage = {
  headers: { cookie: 'refreshToken=mock-refresh' },
} as unknown;

describe('LogoutUserController', () => {
  let mockUseCase: jest.Mocked<LogoutUserUseCase>;
  let controller: LogoutUserController;

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseCase = {
      execute: jest.fn(),
    } as unknown;

    controller = new LogoutUserController(mockUseCase);
  });

  it('should execute logout and clear refresh token cookie', async () => {
    const mockCookieValue = 'cleared-cookie';
    const refreshToken = 'mock-refresh';
    CookieParser.parse.mockReturnValueOnce({ refreshToken });
    CookieSerializer.serialize.mockReturnValueOnce(mockCookieValue);

    const mockNoContent = jest.fn();
    ReplyResponder.mockImplementationOnce(() => ({ noContent: mockNoContent }));

    await controller.handle(mockRequest, mockResponse);

    expect(CookieParser.parse).toHaveBeenCalledWith(mockRequest.headers.cookie);
    expect(mockUseCase.execute).toHaveBeenCalledWith(refreshToken);
    expect(CookieSerializer.serialize).toHaveBeenCalledWith('refreshToken', '', {
      httpOnly: true,
      secure: env.nodeEnv === 'production',
      path: '/',
      sameSite: 'Strict',
      maxAge: 0,
    });
    expect(mockResponse.setHeader).toHaveBeenCalledWith('Set-Cookie', mockCookieValue);
    expect(mockNoContent).toHaveBeenCalled();
  });

  it('should throw InvalidRefreshToken if refresh token is missing', async () => {
    CookieParser.parse.mockReturnValueOnce({});
    await expect(controller.handle(mockRequest, mockResponse)).rejects.toThrow(InvalidRefreshToken);
  });
});
