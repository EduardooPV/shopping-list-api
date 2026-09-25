// @ts-nocheck
import { LoginUserController } from '../../infrastructure/http/controllers/login-user-controller';
import { LoginUserUseCase } from 'modules/auth/application/login-user/login-user-use-case';
import { IncomingMessage, ServerResponse } from 'http';
import { BodyParser } from 'core/http/utils/parse-body';
import { CookieSerializer } from 'core/http/utils/cookies';
import { ReplyResponder } from 'core/http/utils/reply';
import { env } from 'shared/utils/env';
import { REFRESH_TOKEN_MAX_AGE_SECONDS } from 'shared/constants/auth';

const mockResponse: ServerResponse = {
  setHeader: jest.fn(),
  end: jest.fn(),
} as unknown;

const mockRequest: IncomingMessage = {} as unknown;

jest.mock('core/http/utils/parse-body');
jest.mock('core/http/utils/cookies');
jest.mock('core/http/utils/reply');

describe('LoginUserController', () => {
  let mockUseCase: jest.Mocked<LoginUserUseCase>;
  let controller: LoginUserController;

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseCase = {
      execute: jest.fn(),
    } as unknown;

    controller = new LoginUserController(mockUseCase);
  });

  it('should authenticate user and set refresh token cookie', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    const accessToken = 'access-token';
    const refreshToken = 'refresh-token';
    const cookieValue = 'mock-cookie';

    BodyParser.parse.mockResolvedValueOnce({ email, password });

    mockUseCase.execute.mockResolvedValueOnce({ accessToken, refreshToken });

    CookieSerializer.serialize.mockReturnValueOnce(cookieValue);

    const mockOk = jest.fn();
    ReplyResponder.mockImplementationOnce(() => ({ ok: mockOk }));

    await controller.handle(mockRequest, mockResponse);

    expect(BodyParser.parse).toHaveBeenCalledWith(mockRequest);
    expect(mockUseCase.execute).toHaveBeenCalledWith({ email, password });
    expect(CookieSerializer.serialize).toHaveBeenCalledWith('refreshToken', refreshToken, {
      httpOnly: true,
      secure: env.nodeEnv === 'production',
      path: '/',
      sameSite: 'Strict',
      maxAge: REFRESH_TOKEN_MAX_AGE_SECONDS,
    });
    expect(mockResponse.setHeader).toHaveBeenCalledWith('Set-Cookie', cookieValue);
    expect(mockOk).toHaveBeenCalledWith({
      message: 'User authenticated successfully',
      accessToken,
    });
  });

  it('should propagate errors from use case', async () => {
    const mockError = new Error('Invalid credentials');

    BodyParser.parse.mockResolvedValueOnce({ email: 'test@example.com', password: 'wrong' });
    mockUseCase.execute.mockRejectedValueOnce(mockError);

    await expect(controller.handle(mockRequest, mockResponse)).rejects.toThrow(
      'Invalid credentials',
    );
  });
});
