import jsonwebtoken from 'jsonwebtoken';
import { InvalidRefreshToken } from 'modules/auth/domain/errors/invalid-refresh-token';
import { IRefreshTokenResponseDTO } from './refresh-token-dto';
import { env } from 'shared/utils/env';
import { UserNotFound } from 'modules/users/domain/errors/user-not-found';
import { IAuthUserRepository } from 'modules/auth/domain/repositories/auth-user-repository';

class RefreshTokenUseCase {
  constructor(private authRepository: IAuthUserRepository) {}

  async execute(refreshToken: string): Promise<IRefreshTokenResponseDTO> {
    let payload: { sub: string };

    try {
      payload = jsonwebtoken.verify(refreshToken, env.refreshSecretJwt) as { sub: string };
    } catch {
      throw new InvalidRefreshToken();
    }

    const user = await this.authRepository.findByIdWithToken(payload.sub);
    if (!user) throw new UserNotFound();
    if (user.refreshToken !== refreshToken) throw new InvalidRefreshToken();

    const accessToken = jsonwebtoken.sign({ sub: user.id }, env.secretJwt, {
      expiresIn: env.accessTokenExpiration,
    } as jsonwebtoken.SignOptions);

    const newRefreshToken = jsonwebtoken.sign({ sub: user.id }, env.refreshSecretJwt, {
      expiresIn: env.refreshTokenExpiration,
    } as jsonwebtoken.SignOptions);

    await this.authRepository.updateRefreshToken(user.id, newRefreshToken);

    return { accessToken, refreshToken: newRefreshToken };
  }
}

export { RefreshTokenUseCase };
