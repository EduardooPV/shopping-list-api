// @ts-nocheck

import { IncomingMessage, ServerResponse } from 'http';
import { DeleteListByIdUseCase } from 'modules/shopping/application/delete-list-by-id/delete-list-by-id-use-case';
import { ReplyResponder } from 'core/http/utils/reply';
import { DeleteListByIdController } from 'modules/shopping/infrastructure/http/controllers/delete-list-by-id-controller';

describe('DeleteListByIdController', () => {
  let deleteListByIdUseCase: { execute: jest.Mock };
  let controller: DeleteListByIdController;
  let mockRequest: Partial<IncomingMessage> & { userId?: string; params?: { id?: string } };
  let mockResponse: Partial<ServerResponse>;

  beforeEach(() => {
    deleteListByIdUseCase = { execute: jest.fn() };
    controller = new DeleteListByIdController(
      deleteListByIdUseCase as unknown as DeleteListByIdUseCase,
    );

    mockRequest = {
      userId: 'user-123',
      params: { id: 'list-456' },
    };

    mockResponse = {
      setHeader: jest.fn(),
      end: jest.fn(),
    };

    jest.spyOn(ReplyResponder.prototype, 'noContent').mockImplementation(jest.fn());
  });

  it('should delete a list successfully and return 204', async () => {
    await controller.handle(mockRequest as IncomingMessage, mockResponse as ServerResponse);

    expect(deleteListByIdUseCase.execute).toHaveBeenCalledWith({
      userId: 'user-123',
      id: 'list-456',
    });
    expect(ReplyResponder.prototype.noContent).toHaveBeenCalled();
  });

  it('should propagate an error if use case throws', async () => {
    deleteListByIdUseCase.execute.mockRejectedValue(new Error('Failed'));
    await expect(
      controller.handle(mockRequest as IncomingMessage, mockResponse as ServerResponse),
    ).rejects.toThrow('Failed');
  });
});
