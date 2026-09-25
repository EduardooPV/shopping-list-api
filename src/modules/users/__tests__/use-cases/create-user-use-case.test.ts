// @ts-nocheck
import { User } from 'modules/users/domain/entities/user';
import { UserAlreadyExistsError } from 'modules/users/domain/errors/user-already-exists-error';
import bcryptjs from 'bcryptjs';
import { BCRYPT_COST } from 'shared/constants/auth';
import { CreateUserUseCase } from 'modules/users/application/create-user/create-user-use-case';

jest.mock('bcryptjs');

describe('CreateUserUseCase', () => {
  let userRepository: {
    findByEmail: jest.Mock;
    create: jest.Mock;
  };
  let createUserUseCase: CreateUserUseCase;

  beforeEach(() => {
    userRepository = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };

    createUserUseCase = new CreateUserUseCase(userRepository);
  });

  it('should create a new user successfully', async () => {
    const userData = { name: 'John Doe', email: 'john@example.com', password: '123456' };
    const hashedPassword = 'hashed123';
    (bcryptjs.hash as jest.Mock).mockResolvedValue(hashedPassword);
    userRepository.findByEmail.mockResolvedValue(null);

    await createUserUseCase.execute(userData);

    expect(userRepository.findByEmail).toHaveBeenCalledWith('john@example.com');
    expect(bcryptjs.hash).toHaveBeenCalledWith('123456', BCRYPT_COST);
    expect(userRepository.create).toHaveBeenCalledWith(expect.any(User));
  });

  it('should throw UserAlreadyExistsError if user already exists', async () => {
    const userData = { name: 'Jane Doe', email: 'jane@example.com', password: 'abcdef' };
    userRepository.findByEmail.mockResolvedValue(
      User.reconstitute({
        id: 'id-1',
        name: 'Jane',
        email: 'jane@example.com',
        password: 'hashed',
      }),
    );

    await expect(createUserUseCase.execute(userData)).rejects.toThrow(UserAlreadyExistsError);
  });

  it('should hash the password before saving', async () => {
    const userData = { name: 'Jake', email: 'jake@example.com', password: 'plain123' };
    const hashedPassword = 'secure_hashed_password';
    userRepository.findByEmail.mockResolvedValue(null);
    (bcryptjs.hash as jest.Mock).mockResolvedValue(hashedPassword);

    await createUserUseCase.execute(userData);

    expect(bcryptjs.hash).toHaveBeenCalledWith('plain123', BCRYPT_COST);
    expect(userRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ password: hashedPassword }),
    );
  });
});
