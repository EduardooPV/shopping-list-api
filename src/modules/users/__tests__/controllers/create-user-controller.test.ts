// @ts-nocheck

import { CreateUserUseCase } from 'modules/users/application/create-user/create-user-use-case';
import { BodyParser } from 'core/http/utils/parse-body';
import { ReplyResponder } from 'core/http/utils/reply';
import { CreateUserController } from 'modules/users/infrastructure/http/controllers/create-user-controller';

describe('CreateUserController', () => {
  let createUserUseCase: { execute: jest.Mock };
  let controller: CreateUserController;
  let mockRequest: Partial<IncomingMessage>;
  let mockResponse: Partial<ServerResponse>;

  beforeEach(() => {
    createUserUseCase = { execute: jest.fn() };
    controller = new CreateUserController(createUserUseCase as unknown as CreateUserUseCase);
    mockRequest = {};
    mockResponse = {
      setHeader: jest.fn(),
      end: jest.fn(),
    };

    jest.spyOn(BodyParser, 'parse').mockResolvedValue({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    });

    jest.spyOn(ReplyResponder.prototype, 'created').mockImplementation(jest.fn());
  });

  it('should create a user successfully and return 201', async () => {
    await controller.handle(mockRequest as IncomingMessage, mockResponse as ServerResponse);

    expect(BodyParser.parse).toHaveBeenCalledWith(mockRequest);
    expect(createUserUseCase.execute).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    });
    expect(ReplyResponder.prototype.created).toHaveBeenCalledWith(
      {
        name: 'John Doe',
        email: 'john@example.com',
      },
      '/users/:id',
    );
  });

  it('should propagate an error if use case throws', async () => {
    createUserUseCase.execute.mockRejectedValue(new Error('Failed'));
    await expect(
      controller.handle(mockRequest as IncomingMessage, mockResponse as ServerResponse),
    ).rejects.toThrow('Failed');
  });
});
