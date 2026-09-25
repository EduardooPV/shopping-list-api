import { IncomingMessage, ServerResponse } from 'http';
import { LoginUserUseCase } from 'modules/auth/application/login-user/login-user-use-case';
import { BodyParser } from 'core/http/utils/parse-body';
import { env } from 'shared/utils/env';
import { CookieSerializer } from 'core/http/utils/cookies';
import { ReplyResponder } from 'core/http/utils/reply';
import { REFRESH_TOKEN_MAX_AGE_SECONDS } from 'shared/constants/auth';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

class LoginUserController {
  constructor(private authenticateUserUseCase: LoginUserUseCase) {}

  async handle(request: IncomingMessage, response: ServerResponse): Promise<void> {
    const rawBody = await BodyParser.parse(request);

    const { email, password } = schema.parse(rawBody);

    const { accessToken, refreshToken } = await this.authenticateUserUseCase.execute({
      email,
      password,
    });

    const cookie = CookieSerializer.serialize('refreshToken', refreshToken, {
      httpOnly: true,
      secure: env.nodeEnv === 'production',
      path: '/',
      sameSite: 'Strict',
      maxAge: REFRESH_TOKEN_MAX_AGE_SECONDS,
    });

    response.setHeader('Set-Cookie', cookie);
    new ReplyResponder(response).ok({ message: 'User authenticated successfully', accessToken });
  }
}

export { LoginUserController };
