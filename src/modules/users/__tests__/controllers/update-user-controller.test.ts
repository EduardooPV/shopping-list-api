// @ts-nocheck
import { UpdateUserUseCase } from 'modules/users/application/update-user/update-user-use-case';
import { BodyParser } from 'core/http/utils/parse-body';
import { ReplyResponder } from 'core/http/utils/reply';
import { UpdateUserViewModel } from 'modules/users/application/update-user/update-user-view-model';
import { UpdateUserController } from 'modules/users/infrastructure/http/controllers/update-user-controller';
import { IncomingMessage, ServerResponse } from 'http';

describe('UpdateUserController', () => {
  let updateUserUseCase: { execute: jest.Mock };
  let controller: UpdateUserController;
  let mockRequest: Partial<IncomingMessage & { userId?: string }>;
  let mockResponse: Partial<ServerResponse>;

  beforeEach(() => {
    updateUserUseCase = { execute: jest.fn() };
    controller = new UpdateUserController(updateUserUseCase as unknown as UpdateUserUseCase);

    mockRequest = {
      userId: 'user-123',
    };
    mockResponse = {
      setHeader: jest.fn(),
      end: jest.fn(),
    };

    jest.spyOn(BodyParser, 'parse').mockResolvedValue({
      name: 'John Updated',
      password: 'newpassword123',
    });

    jest.spyOn(UpdateUserViewModel, 'toHTTP').mockReturnValue({
      id: 'user-123',
      name: 'John Updated',
      email: 'john.updated@example.com',
    });

    jest.spyOn(ReplyResponder.prototype, 'ok').mockImplementation(jest.fn());
  });

  it('should update user and return HTTP response', async () => {
    const mockUser = {
      id: 'user-123',
      name: 'John Updated',
      email: 'john.updated@example.com',
    };

    updateUserUseCase.execute.mockResolvedValue(mockUser);

    await controller.handle(mockRequest as IncomingMessage, mockResponse as ServerResponse);

    expect(BodyParser.parse).toHaveBeenCalledWith(mockRequest);
    expect(updateUserUseCase.execute).toHaveBeenCalledWith({
      id: 'user-123',
      name: 'John Updated',
      password: 'newpassword123',
    });
    expect(UpdateUserViewModel.toHTTP).toHaveBeenCalledWith(mockUser);
    expect(ReplyResponder.prototype.ok).toHaveBeenCalledWith({
      id: 'user-123',
      name: 'John Updated',
      email: 'john.updated@example.com',
    });
  });

  it('should throw an error if use case fails', async () => {
    updateUserUseCase.execute.mockRejectedValue(new Error('Update failed'));

    await expect(
      controller.handle(mockRequest as IncomingMessage, mockResponse as ServerResponse),
    ).rejects.toThrow('Update failed');
  });
});
