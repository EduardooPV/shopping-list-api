// @ts-nocheck
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import bcryptjs from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import { InvalidCredentials } from 'modules/auth/domain/errors/invalid-credentials';
import { IAuthUserRepository } from 'modules/auth/domain/repositories/auth-user-repository';
import { LoginUserUseCase } from 'modules/auth/application/login-user/login-user-use-case';

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('shared/utils/env', () => ({
  env: {
    secretJwt: 'test-secret',
    refreshSecretJwt: 'refresh-secret',
    accessTokenExpiration: '15m',
    refreshTokenExpiration: '7d',
  },
}));

describe('LoginUserUseCase', () => {
  let authRepository: jest.Mocked<IAuthUserRepository>;
  let useCase: LoginUserUseCase;

  const mockUser = {
    id: 'user-123',
    password: 'hashed-password',
  };

  beforeEach(() => {
    authRepository = {
      findByEmailWithPassword: jest.fn(),
      findByIdWithToken: jest.fn(),
      updateRefreshToken: jest.fn(),
    } as unknown as jest.Mocked<IAuthUserRepository>;

    useCase = new LoginUserUseCase(authRepository);
    jest.clearAllMocks();
  });

  it('should successfully authenticate a valid user', async () => {
    authRepository.findByEmailWithPassword.mockResolvedValueOnce(mockUser);
    (bcryptjs.compare as jest.Mock).mockResolvedValueOnce(true);
    (jsonwebtoken.sign as jest.Mock)
      .mockReturnValueOnce('access-token')
      .mockReturnValueOnce('refresh-token');

    const result = await useCase.execute({ email: 'john@example.com', password: 'plain-password' });

    expect(authRepository.findByEmailWithPassword).toHaveBeenCalledWith('john@example.com');
    expect(bcryptjs.compare).toHaveBeenCalledWith('plain-password', mockUser.password);
    expect(authRepository.updateRefreshToken).toHaveBeenCalledWith(mockUser.id, 'refresh-token');
    expect(result).toEqual({ accessToken: 'access-token', refreshToken: 'refresh-token' });
  });

  it('should throw InvalidCredentials if user is not found', async () => {
    authRepository.findByEmailWithPassword.mockResolvedValueOnce(null);

    await expect(
      useCase.execute({ email: 'notfound@example.com', password: 'any' }),
    ).rejects.toBeInstanceOf(InvalidCredentials);

    expect(bcryptjs.compare).not.toHaveBeenCalled();
  });

  it('should throw InvalidCredentials if password does not match', async () => {
    authRepository.findByEmailWithPassword.mockResolvedValueOnce(mockUser);
    (bcryptjs.compare as jest.Mock).mockResolvedValueOnce(false);

    await expect(
      useCase.execute({ email: 'john@example.com', password: 'wrong-password' }),
    ).rejects.toBeInstanceOf(InvalidCredentials);

    expect(jsonwebtoken.sign).not.toHaveBeenCalled();
  });

  it('should update refresh token after successful login', async () => {
    authRepository.findByEmailWithPassword.mockResolvedValueOnce(mockUser);
    (bcryptjs.compare as jest.Mock).mockResolvedValueOnce(true);
    (jsonwebtoken.sign as jest.Mock)
      .mockReturnValueOnce('access-token')
      .mockReturnValueOnce('refresh-token');

    await useCase.execute({ email: 'john@example.com', password: 'correct-password' });

    expect(authRepository.updateRefreshToken).toHaveBeenCalledWith(mockUser.id, 'refresh-token');
  });
});
