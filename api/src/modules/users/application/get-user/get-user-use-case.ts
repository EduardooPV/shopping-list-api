import { User } from 'modules/users/domain/entities/user';
import { InvalidUserIdError } from 'modules/users/domain/errors/invalid-user-id-error';
import { UserNotFound } from 'modules/users/domain/errors/user-not-found';
import { IUsersRepository } from 'modules/users/domain/repositories/user-repository';
import { IGetUserRequestDTO } from './get-user-dto';

class GetUserUseCase {
  constructor(private userRepository: IUsersRepository) {}

  async execute(data: IGetUserRequestDTO): Promise<User> {
    if (data.id == null) throw new InvalidUserIdError({ reason: 'missing' });

    const user = await this.userRepository.findById(data.id);

    if (!user) throw new UserNotFound();

    return user;
  }
}
export { GetUserUseCase };
