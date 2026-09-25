import { InvalidUserIdError } from 'modules/users/domain/errors/invalid-user-id-error';
import { UserNotFound } from 'modules/users/domain/errors/user-not-found';
import { IUsersRepository } from 'modules/users/domain/repositories/user-repository';
import { IUpdateUserRequestDTO } from './update-user-dto';
import { User } from 'modules/users/domain/entities/user';
import bcryptjs from 'bcryptjs';
import { BCRYPT_COST } from 'shared/constants/auth';

class UpdateUserUseCase {
  constructor(private userRepository: IUsersRepository) {}

  async execute(data: IUpdateUserRequestDTO): Promise<User> {
    if (data.id == null) throw new InvalidUserIdError({ reason: 'missing' });

    const userExist = await this.userRepository.findById(data.id);

    if (!userExist) throw new UserNotFound();

    if (data.password) {
      data = { ...data, password: await bcryptjs.hash(data.password, BCRYPT_COST) };
    }

    const newUser = await this.userRepository.updateById(data);

    if (!newUser) throw new UserNotFound();

    return newUser;
  }
}

export { UpdateUserUseCase };
