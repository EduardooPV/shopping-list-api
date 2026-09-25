import { User } from 'modules/users/domain/entities/user';

interface IUsersRepository {
  create(user: User): Promise<void>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  deleteById(id: string): Promise<void>;
  updateById(data: {
    id: string;
    name?: string;
    email?: string;
    password?: string;
  }): Promise<User | null>;
}

export { IUsersRepository };
