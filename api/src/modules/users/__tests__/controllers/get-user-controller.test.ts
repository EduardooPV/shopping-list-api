// @ts-nocheck
import { GetUserUseCase } from 'modules/users/application/get-user/get-user-use-case';
import { ReplyResponder } from 'core/http/utils/reply';
import { GetUserViewModel } from 'modules/users/application/get-user/get-user-view-model';
import { GetUserController } from 'modules/users/infrastructure/http/controllers/get-user-controller';

describe('GetUserController', () => {
  let getUserUseCase: { execute: jest.Mock };
  let controller: GetUserController;
  let mockRequest: Partial<IncomingMessage & { userId?: string }>;
  let mockResponse: Partial<ServerResponse>;

  beforeEach(() => {
    getUserUseCase = { execute: jest.fn() };
    controller = new GetUserController(getUserUseCase as unknown as GetUserUseCase);

    mockRequest = { userId: 'user-123' };
    mockResponse = {
      setHeader: jest.fn(),
      end: jest.fn(),
    };

    jest.spyOn(GetUserViewModel, 'toHTTP').mockReturnValue({
      id: 'user-123',
      name: 'John Doe',
      email: 'john@example.com',
    });

    jest.spyOn(ReplyResponder.prototype, 'ok').mockImplementation(jest.fn());
  });

  it('should return user data successfully', async () => {
    const mockUser = { id: 'user-123', name: 'John Doe', email: 'john@example.com' };
    getUserUseCase.execute.mockResolvedValue(mockUser);

    await controller.handle(mockRequest as unknown, mockResponse as ServerResponse);

    expect(getUserUseCase.execute).toHaveBeenCalledWith({ id: 'user-123' });
    expect(GetUserViewModel.toHTTP).toHaveBeenCalledWith(mockUser);
    expect(ReplyResponder.prototype.ok).toHaveBeenCalledWith({
      id: 'user-123',
      name: 'John Doe',
      email: 'john@example.com',
    });
  });

  it('should throw an error if use case fails', async () => {
    getUserUseCase.execute.mockRejectedValue(new Error('User not found'));

    await expect(
      controller.handle(mockRequest as unknown, mockResponse as ServerResponse),
    ).rejects.toThrow('User not found');
  });
});
