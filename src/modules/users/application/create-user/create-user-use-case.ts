import { User } from 'modules/users/domain/entities/user';
import { UserAlreadyExistsError } from 'modules/users/domain/errors/user-already-exists-error';
import { IUsersRepository } from 'modules/users/domain/repositories/user-repository';
import { ICreateUserRequestDTO } from './create-user-dto';
import bcryptjs from 'bcryptjs';
import { BCRYPT_COST } from 'shared/constants/auth';

class CreateUserUseCase {
  constructor(private userRepository: IUsersRepository) {}

  async execute(data: ICreateUserRequestDTO): Promise<void> {
    const userAlreadyExist = await this.userRepository.findByEmail(data.email);

    if (userAlreadyExist) throw new UserAlreadyExistsError(data.email);

    const passwordHash = await bcryptjs.hash(data.password, BCRYPT_COST);

    const user = User.create(data.name, data.email, passwordHash);

    await this.userRepository.create(user);
  }
}

export { CreateUserUseCase };
