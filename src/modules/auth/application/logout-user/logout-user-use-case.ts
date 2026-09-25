import jsonwebtoken from 'jsonwebtoken';
import { env } from 'shared/utils/env';
import { InvalidRefreshToken } from 'modules/auth/domain/errors/invalid-refresh-token';
import { UserNotFound } from 'modules/users/domain/errors/user-not-found';
import { IAuthUserRepository } from 'modules/auth/domain/repositories/auth-user-repository';

class LogoutUserUseCase {
  constructor(private authRepository: IAuthUserRepository) {}

  async execute(refreshToken: string): Promise<void> {
    let payload: { sub: string };

    try {
      payload = jsonwebtoken.verify(refreshToken, env.refreshSecretJwt) as { sub: string };
    } catch {
      throw new InvalidRefreshToken();
    }

    const user = await this.authRepository.findByIdWithToken(payload.sub);
    if (!user) throw new UserNotFound();
    if (user.refreshToken == null) throw new InvalidRefreshToken();

    await this.authRepository.updateRefreshToken(user.id, null);
  }
}

export { LogoutUserUseCase };
