import { InvalidUserIdError } from 'modules/users/domain/errors/invalid-user-id-error';
import { UserNotFound } from 'modules/users/domain/errors/user-not-found';
import { IUsersRepository } from 'modules/users/domain/repositories/user-repository';
import { IDeleteUserRequestDTO } from './delete-user-dto';

class DeleteUserUseCase {
  constructor(private userRepository: IUsersRepository) {}

  async execute(data: IDeleteUserRequestDTO): Promise<void> {
    if (data.id == null) throw new InvalidUserIdError({ reason: 'missing' });

    const user = await this.userRepository.findById(data.id);

    if (!user) throw new UserNotFound();

    await this.userRepository.deleteById(data.id);
  }
}
export { DeleteUserUseCase };
