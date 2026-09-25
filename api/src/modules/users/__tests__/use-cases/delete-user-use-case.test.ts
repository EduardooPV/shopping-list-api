// @ts-nocheck

import { InvalidUserIdError } from 'modules/users/domain/errors/invalid-user-id-error';
import { UserNotFound } from 'modules/users/domain/errors/user-not-found';
import { User } from 'modules/users/domain/entities/user';
import { DeleteUserUseCase } from 'modules/users/application/delete-user/delete-user-use-case';

describe('DeleteUserUseCase', () => {
  let userRepository: {
    findById: jest.Mock;
    deleteById: jest.Mock;
  };
  let deleteUserUseCase: DeleteUserUseCase;

  beforeEach(() => {
    userRepository = {
      findById: jest.fn(),
      deleteById: jest.fn(),
    };
    deleteUserUseCase = new DeleteUserUseCase(userRepository);
  });

  it('should delete a user successfully', async () => {
    const user = new User('John Doe', 'john@example.com', 'hashedpassword');
    userRepository.findById.mockResolvedValue(user);

    await deleteUserUseCase.execute({ id: user.id });

    expect(userRepository.findById).toHaveBeenCalledWith(user.id);
    expect(userRepository.deleteById).toHaveBeenCalledWith(user.id);
  });

  it('should throw InvalidUserIdError if id is missing', async () => {
    await expect(deleteUserUseCase.execute({ id: null })).rejects.toThrow(InvalidUserIdError);
  });

  it('should throw UserNotFound if user does not exist', async () => {
    userRepository.findById.mockResolvedValue(null);

    await expect(deleteUserUseCase.execute({ id: 'nonexistent-id' })).rejects.toThrow(UserNotFound);
  });
});
