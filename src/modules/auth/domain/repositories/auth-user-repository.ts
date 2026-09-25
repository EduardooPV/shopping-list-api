interface IAuthUserRepository {
  findByEmailWithPassword(email: string): Promise<{ id: string; password: string } | null>;
  findByIdWithToken(id: string): Promise<{ id: string; refreshToken: string | null } | null>;
  updateRefreshToken(userId: string, token: string | null): Promise<void>;
}

export { IAuthUserRepository };
