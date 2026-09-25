import { IUpdateUserRequestDTO } from 'modules/users/application/update-user/update-user-dto';
import { User } from 'modules/users/domain/entities/user';
import { IUsersRepository } from 'modules/users/domain/repositories/user-repository';
import { prisma } from 'core/database/prisma-client';

class PostgresUsersRepository implements IUsersRepository {
  async create(user: User): Promise<void> {
    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
        id: user.id,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email: email },
    });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id: id },
    });
  }

  async deleteById(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id: id },
    });
  }

  async updateById(data: IUpdateUserRequestDTO): Promise<User | null> {
    return await prisma.user.update({
      where: { id: data.id },
      data,
    });
  }

  async updateRefreshToken(userId: string, refreshToken: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: refreshToken },
    });
  }
}

export { PostgresUsersRepository };
