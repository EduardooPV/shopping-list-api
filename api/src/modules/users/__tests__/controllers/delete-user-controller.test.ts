// @ts-nocheck

import { DeleteUserUseCase } from 'modules/users/application/delete-user/delete-user-use-case';
import { ReplyResponder } from 'core/http/utils/reply';
import { DeleteUserController } from 'modules/users/infrastructure/http/controllers/delete-user-controller';

describe('DeleteUserController', () => {
  let deleteUserUseCase: { execute: jest.Mock };
  let controller: DeleteUserController;
  let mockRequest: Partial<IncomingMessage & { userId?: string }>;
  let mockResponse: Partial<ServerResponse>;

  beforeEach(() => {
    deleteUserUseCase = { execute: jest.fn() };
    controller = new DeleteUserController(deleteUserUseCase as unknown as DeleteUserUseCase);

    mockRequest = { userId: 'user-123' };
    mockResponse = {
      setHeader: jest.fn(),
      end: jest.fn(),
    };

    jest.spyOn(ReplyResponder.prototype, 'noContent').mockImplementation(jest.fn());
  });

  it('should delete a user successfully and respond with no content', async () => {
    await controller.handle(mockRequest as unknown, mockResponse as ServerResponse);

    expect(deleteUserUseCase.execute).toHaveBeenCalledWith({ id: 'user-123' });
    expect(ReplyResponder.prototype.noContent).toHaveBeenCalled();
  });

  it('should throw an error if use case fails', async () => {
    deleteUserUseCase.execute.mockRejectedValue(new Error('Delete failed'));

    await expect(
      controller.handle(mockRequest as unknown, mockResponse as ServerResponse),
    ).rejects.toThrow('Delete failed');
  });
});
