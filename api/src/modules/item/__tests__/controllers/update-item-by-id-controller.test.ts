// @ts-nocheck

import { IncomingMessage, ServerResponse } from 'http';
import { BodyParser } from 'core/http/utils/parse-body';
import { ReplyResponder } from 'core/http/utils/reply';
import { UpdateItemByIdUseCase } from 'modules/item/application/update-item-by-id/update-item-by-id-use-case';
import { UpdateItemByIdViewModel } from 'modules/item/application/update-item-by-id/update-item-by-id-view-model';
import { UpdateItemByIdController } from 'modules/item/infrastructure/http/controllers/update-item-by-id-controller';

describe('UpdateItemByIdController', () => {
  let updateItemByIdUseCase: { execute: jest.Mock };
  let controller: UpdateItemByIdController;
  let mockRequest: Partial<IncomingMessage> & {
    userId?: string;
    params?: { shoppingListId?: string; itemId?: string };
  };
  let mockResponse: Partial<ServerResponse>;

  beforeEach(() => {
    updateItemByIdUseCase = { execute: jest.fn() };
    controller = new UpdateItemByIdController(
      updateItemByIdUseCase as unknown as UpdateItemByIdUseCase,
    );
    mockRequest = {
      userId: 'user-123',
      params: { shoppingListId: 'list-456', itemId: 'item-789' },
    };
    mockResponse = {
      setHeader: jest.fn(),
      end: jest.fn(),
    };

    jest.spyOn(BodyParser, 'parse').mockResolvedValue({ name: 'Bananas', amount: 5 });
    jest.spyOn(UpdateItemByIdViewModel, 'toHTTP').mockReturnValue({
      id: 'item-789',
      name: 'Bananas',
      amount: 5,
      shoppingListId: 'list-456',
      userId: 'user-123',
    });

    jest.spyOn(ReplyResponder.prototype, 'ok').mockImplementation(jest.fn());
  });

  it('should update an item successfully and return 200', async () => {
    updateItemByIdUseCase.execute.mockResolvedValue({
      id: 'item-789',
      name: 'Bananas',
      amount: 5,
      shoppingListId: 'list-456',
      userId: 'user-123',
    });

    await controller.handle(mockRequest as IncomingMessage, mockResponse as ServerResponse);

    expect(BodyParser.parse).toHaveBeenCalledWith(mockRequest);
    expect(updateItemByIdUseCase.execute).toHaveBeenCalledWith({
      name: 'Bananas',
      amount: 5,
      shoppingListId: 'list-456',
      userId: 'user-123',
      itemId: 'item-789',
    });
    expect(UpdateItemByIdViewModel.toHTTP).toHaveBeenCalledWith({
      id: 'item-789',
      name: 'Bananas',
      amount: 5,
      shoppingListId: 'list-456',
      userId: 'user-123',
    });
    expect(ReplyResponder.prototype.ok).toHaveBeenCalledWith({
      id: 'item-789',
      name: 'Bananas',
      amount: 5,
      shoppingListId: 'list-456',
      userId: 'user-123',
    });
  });

  it('should propagate an error if use case throws', async () => {
    updateItemByIdUseCase.execute.mockRejectedValue(new Error('Failed'));
    await expect(
      controller.handle(mockRequest as IncomingMessage, mockResponse as ServerResponse),
    ).rejects.toThrow('Failed');
  });
});
