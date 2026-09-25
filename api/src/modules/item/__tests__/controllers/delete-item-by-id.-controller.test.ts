// @ts-nocheck

import { IncomingMessage, ServerResponse } from 'http';
import { DeleteItemByIdUseCase } from 'modules/item/application/delete-item-by-id/delete-item-by-id-use-case';
import { ReplyResponder } from 'core/http/utils/reply';
import { DeleteItemByIdController } from 'modules/item/infrastructure/http/controllers/delete-item-by-id-controller';

describe('DeleteItemByIdController', () => {
  let deleteItemByIdUseCase: { execute: jest.Mock };
  let controller: DeleteItemByIdController;
  let mockRequest: Partial<IncomingMessage> & {
    userId?: string;
    params?: { shoppingListId?: string; itemId?: string };
  };
  let mockResponse: Partial<ServerResponse>;

  beforeEach(() => {
    deleteItemByIdUseCase = { execute: jest.fn() };
    controller = new DeleteItemByIdController(
      deleteItemByIdUseCase as unknown as DeleteItemByIdUseCase,
    );
    mockRequest = {
      userId: 'user-123',
      params: { shoppingListId: 'list-456', itemId: 'item-789' },
    };
    mockResponse = {
      setHeader: jest.fn(),
      end: jest.fn(),
    };

    jest.spyOn(ReplyResponder.prototype, 'noContent').mockImplementation(jest.fn());
  });

  it('should delete an item successfully and return 204', async () => {
    deleteItemByIdUseCase.execute.mockResolvedValue(undefined);

    await controller.handle(mockRequest as IncomingMessage, mockResponse as ServerResponse);

    expect(deleteItemByIdUseCase.execute).toHaveBeenCalledWith({
      itemId: 'item-789',
      shoppingListId: 'list-456',
      userId: 'user-123',
    });
    expect(ReplyResponder.prototype.noContent).toHaveBeenCalled();
  });

  it('should propagate an error if use case throws', async () => {
    deleteItemByIdUseCase.execute.mockRejectedValue(new Error('Failed'));
    await expect(
      controller.handle(mockRequest as IncomingMessage, mockResponse as ServerResponse),
    ).rejects.toThrow('Failed');
  });
});
