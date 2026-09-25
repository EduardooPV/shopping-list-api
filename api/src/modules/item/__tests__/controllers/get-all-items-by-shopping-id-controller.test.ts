// @ts-nocheck

import { IncomingMessage, ServerResponse } from 'http';
import { ReplyResponder } from 'core/http/utils/reply';
import { GetAllItemsByShoppingIdUseCase } from 'modules/item/application/get-all-items-by-shopping-id/get-all-items-by-shopping-id-use-case';
import { GetAllItemsByShoppingIdViewModel } from 'modules/item/application/get-all-items-by-shopping-id/get-all-items-by-shopping-id-view-model';
import { GetAllItemsByShoppingIdController } from 'modules/item/infrastructure/http/controllers/get-all-items-by-shopping-id-controller';

describe('GetAllItemsByShoppingIdController', () => {
  let getAllItemsByShoppingIdUseCase: { execute: jest.Mock };
  let controller: GetAllItemsByShoppingIdController;
  let mockRequest: Partial<IncomingMessage> & {
    userId?: string;
    params?: { shoppingListId?: string };
  };
  let mockResponse: Partial<ServerResponse>;

  beforeEach(() => {
    getAllItemsByShoppingIdUseCase = { execute: jest.fn() };
    controller = new GetAllItemsByShoppingIdController(
      getAllItemsByShoppingIdUseCase as unknown as GetAllItemsByShoppingIdUseCase,
    );
    mockRequest = { userId: 'user-123', params: { shoppingListId: 'list-456' } };
    mockResponse = {
      setHeader: jest.fn(),
      end: jest.fn(),
    };

    jest.spyOn(GetAllItemsByShoppingIdViewModel, 'toHTTP').mockImplementation((item) => ({
      id: item.id,
      name: item.name,
      shoppingListId: item.shoppingListId,
      userId: item.userId,
    }));

    jest.spyOn(ReplyResponder.prototype, 'created').mockImplementation(jest.fn());
  });

  it('should return all items successfully and return 201', async () => {
    const mockItems = [
      { id: 'item-1', name: 'Bananas', shoppingListId: 'list-456', userId: 'user-123' },
      { id: 'item-2', name: 'Apples', shoppingListId: 'list-456', userId: 'user-123' },
    ];

    getAllItemsByShoppingIdUseCase.execute.mockResolvedValue(mockItems);

    await controller.handle(mockRequest as IncomingMessage, mockResponse as ServerResponse);

    expect(getAllItemsByShoppingIdUseCase.execute).toHaveBeenCalledWith({
      shoppingListId: 'list-456',
      userId: 'user-123',
    });
    expect(GetAllItemsByShoppingIdViewModel.toHTTP).toHaveBeenCalledTimes(2);
    expect(ReplyResponder.prototype.created).toHaveBeenCalledWith([
      {
        id: 'item-1',
        name: 'Bananas',
        shoppingListId: 'list-456',
        userId: 'user-123',
      },
      {
        id: 'item-2',
        name: 'Apples',
        shoppingListId: 'list-456',
        userId: 'user-123',
      },
    ]);
  });

  it('should propagate an error if use case throws', async () => {
    getAllItemsByShoppingIdUseCase.execute.mockRejectedValue(new Error('Failed'));
    await expect(
      controller.handle(mockRequest as IncomingMessage, mockResponse as ServerResponse),
    ).rejects.toThrow('Failed');
  });
});
