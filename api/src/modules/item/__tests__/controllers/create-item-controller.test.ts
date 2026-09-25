// @ts-nocheck

import { IncomingMessage, ServerResponse } from 'http';
import { CreateItemUseCase } from 'modules/item/application/create-item/create-item-use-case';
import { BodyParser } from 'core/http/utils/parse-body';
import { ReplyResponder } from 'core/http/utils/reply';
import { CreateItemViewModel } from 'modules/item/application/create-item/create-list-view-model';
import { CreateItemController } from 'modules/item/infrastructure/http/controllers/create-item-controller';

describe('CreateItemController', () => {
  let createItemUseCase: { execute: jest.Mock };
  let controller: CreateItemController;
  let mockRequest: Partial<IncomingMessage> & {
    userId?: string;
    params?: { shoppingListId?: string };
  };
  let mockResponse: Partial<ServerResponse>;

  beforeEach(() => {
    createItemUseCase = { execute: jest.fn() };
    controller = new CreateItemController(createItemUseCase as unknown as CreateItemUseCase);
    mockRequest = { userId: 'user-123', params: { shoppingListId: 'list-456' } };
    mockResponse = {
      setHeader: jest.fn(),
      end: jest.fn(),
    };

    jest
      .spyOn(BodyParser, 'parse')
      .mockResolvedValue({ name: 'Bananas', quantity: 2, amount: 3.5 });
    jest.spyOn(CreateItemViewModel, 'toHTTP').mockReturnValue({
      id: 'item-1',
      name: 'Bananas',
      shoppingListId: 'list-456',
      userId: 'user-123',
    });

    jest.spyOn(ReplyResponder.prototype, 'created').mockImplementation(jest.fn());
  });

  it('should create an item successfully and return 201', async () => {
    createItemUseCase.execute.mockResolvedValue({
      id: 'item-1',
      name: 'Bananas',
      shoppingListId: 'list-456',
      userId: 'user-123',
    });

    await controller.handle(mockRequest as IncomingMessage, mockResponse as ServerResponse);

    expect(BodyParser.parse).toHaveBeenCalledWith(mockRequest);
    expect(createItemUseCase.execute).toHaveBeenCalledWith({
      name: 'Bananas',
      quantity: 2,
      amount: 3.5,
      status: 'pending',
      shoppingListId: 'list-456',
      userId: 'user-123',
    });
    expect(CreateItemViewModel.toHTTP).toHaveBeenCalledWith({
      id: 'item-1',
      name: 'Bananas',
      shoppingListId: 'list-456',
      userId: 'user-123',
    });
    expect(ReplyResponder.prototype.created).toHaveBeenCalledWith({
      id: 'item-1',
      name: 'Bananas',
      shoppingListId: 'list-456',
      userId: 'user-123',
    });
  });

  it('should propagate an error if use case throws', async () => {
    createItemUseCase.execute.mockRejectedValue(new Error('Failed'));
    await expect(
      controller.handle(mockRequest as IncomingMessage, mockResponse as ServerResponse),
    ).rejects.toThrow('Failed');
  });
});
