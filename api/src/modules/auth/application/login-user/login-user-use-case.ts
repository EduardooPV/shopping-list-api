import bcryptjs from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import { IAuthenticateUserRequestDTO } from './login-user-dto';
import { InvalidCredentials } from 'modules/auth/domain/errors/invalid-credentials';
import { IRefreshTokenResponseDTO } from 'modules/auth/application/refresh-token/refresh-token-dto';
import { env } from 'shared/utils/env';
import { IAuthUserRepository } from 'modules/auth/domain/repositories/auth-user-repository';

class LoginUserUseCase {
  constructor(private authRepository: IAuthUserRepository) {}

  async execute(data: IAuthenticateUserRequestDTO): Promise<IRefreshTokenResponseDTO> {
    const user = await this.authRepository.findByEmailWithPassword(data.email);
    if (!user) throw new InvalidCredentials();

    const isPasswordMatch = await bcryptjs.compare(data.password, user.password);
    if (!isPasswordMatch) throw new InvalidCredentials();

    const accessToken = jsonwebtoken.sign({ sub: user.id }, env.secretJwt, {
      expiresIn: env.accessTokenExpiration,
    } as jsonwebtoken.SignOptions);

    const refreshToken = jsonwebtoken.sign({ sub: user.id }, env.refreshSecretJwt, {
      expiresIn: env.refreshTokenExpiration,
    } as jsonwebtoken.SignOptions);

    await this.authRepository.updateRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  }
}

export { LoginUserUseCase };
