// @ts-nocheck

import { InvalidUserIdError } from 'modules/users/domain/errors/invalid-user-id-error';
import { UserNotFound } from 'modules/users/domain/errors/user-not-found';
import { User } from 'modules/users/domain/entities/user';
import { UpdateUserUseCase } from 'modules/users/application/update-user/update-user-use-case';

describe('UpdateUserUseCase', () => {
  let userRepository: {
    findById: jest.Mock;
    updateById: jest.Mock;
  };
  let updateUserUseCase: UpdateUserUseCase;

  beforeEach(() => {
    userRepository = {
      findById: jest.fn(),
      updateById: jest.fn(),
    };
    updateUserUseCase = new UpdateUserUseCase(userRepository);
  });

  it('should update and return a user successfully', async () => {
    const existingUser = new User('John Doe', 'john@example.com', 'hashedpassword');
    const updatedUser = new User('John Updated', 'john@example.com', 'hashedpassword');

    userRepository.findById.mockResolvedValue(existingUser);
    userRepository.updateById.mockResolvedValue(updatedUser);

    const result = await updateUserUseCase.execute({
      id: existingUser.id,
      name: 'John Updated',
    });

    expect(userRepository.findById).toHaveBeenCalledWith(existingUser.id);
    expect(userRepository.updateById).toHaveBeenCalledWith({
      id: existingUser.id,
      name: 'John Updated',
    });
    expect(result).toEqual(updatedUser);
  });

  it('should throw InvalidUserIdError if id is missing', async () => {
    await expect(updateUserUseCase.execute({ id: null })).rejects.toThrow(InvalidUserIdError);
  });

  it('should throw UserNotFound if user does not exist before update', async () => {
    userRepository.findById.mockResolvedValue(null);
    await expect(updateUserUseCase.execute({ id: 'nonexistent-id' })).rejects.toThrow(UserNotFound);
  });

  it('should throw UserNotFound if repository fails to return updated user', async () => {
    const existingUser = new User('John Doe', 'john@example.com', 'hashedpassword');

    userRepository.findById.mockResolvedValue(existingUser);
    userRepository.updateById.mockResolvedValue(null);

    await expect(updateUserUseCase.execute({ id: existingUser.id })).rejects.toThrow(UserNotFound);
  });
});
