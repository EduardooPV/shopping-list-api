// @ts-nocheck
import { User } from 'modules/users/domain/entities/user';
import { InvalidUserIdError } from 'modules/users/domain/errors/invalid-user-id-error';
import { UserNotFound } from 'modules/users/domain/errors/user-not-found';
import { GetUserUseCase } from 'modules/users/application/get-user/get-user-use-case';

describe('GetUserUseCase', () => {
  let userRepository: {
    findById: jest.Mock;
  };
  let getUserUseCase: GetUserUseCase;

  beforeEach(() => {
    userRepository = {
      findById: jest.fn(),
    };
    getUserUseCase = new GetUserUseCase(userRepository);
  });

  it('should return a user successfully', async () => {
    const user = new User('Jane Doe', 'jane@example.com', 'hashedpassword');
    userRepository.findById.mockResolvedValue(user);

    const result = await getUserUseCase.execute({ id: user.id });

    expect(userRepository.findById).toHaveBeenCalledWith(user.id);
    expect(result).toEqual(user);
  });

  it('should throw InvalidUserIdError if id is missing', async () => {
    await expect(getUserUseCase.execute({ id: null })).rejects.toThrow(InvalidUserIdError);
  });

  it('should throw UserNotFound if user does not exist', async () => {
    userRepository.findById.mockResolvedValue(null);

    await expect(getUserUseCase.execute({ id: 'nonexistent-id' })).rejects.toThrow(UserNotFound);
  });
});
