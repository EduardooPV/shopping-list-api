import { User } from 'modules/users/domain/entities/user';
import { IUsersRepository } from 'modules/users/domain/repositories/user-repository';
import { IAuthUserRepository } from 'modules/auth/domain/repositories/auth-user-repository';
import { prisma } from 'core/database/prisma-client';

class PostgresUsersRepository implements IUsersRepository, IAuthUserRepository {
  async create(user: User): Promise<void> {
    await prisma.user.create({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const data = await prisma.user.findUnique({ where: { email } });
    return data ? User.reconstitute(data) : null;
  }

  async findById(id: string): Promise<User | null> {
    const data = await prisma.user.findUnique({ where: { id } });
    return data ? User.reconstitute(data) : null;
  }

  async deleteById(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }

  async updateById(data: {
    id: string;
    name?: string;
    email?: string;
    password?: string;
  }): Promise<User | null> {
    const { id, ...fields } = data;
    const updated = await prisma.user.update({
      where: { id },
      data: fields,
    });
    return User.reconstitute(updated);
  }

  async findByEmailWithPassword(email: string): Promise<{ id: string; password: string } | null> {
    return prisma.user.findUnique({
      where: { email },
      select: { id: true, password: true },
    });
  }

  async findByIdWithToken(id: string): Promise<{ id: string; refreshToken: string | null } | null> {
    return prisma.user.findUnique({
      where: { id },
      select: { id: true, refreshToken: true },
    });
  }

  async updateRefreshToken(userId: string, token: string | null): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: token },
    });
  }
}

export { PostgresUsersRepository };
