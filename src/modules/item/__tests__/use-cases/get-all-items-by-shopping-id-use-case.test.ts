// @ts-nocheck
import { GetAllItemsByShoppingIdUseCase } from 'modules/item/application/get-all-items-by-shopping-id/get-all-items-by-shopping-id-use-case';
import { InvalidShoppingListId } from 'modules/item/domain/errors/invalid-shopping-list-id';
import { ListNotFound } from 'modules/shopping/domain/errors/list-not-found';
import { NoPermission } from 'shared/errors/no-permission';
import { ItemList } from 'modules/item/domain/entities/item-list';
import { ItemStatus } from 'modules/item/domain/value-objects/item-status';

describe('GetAllItemsByShoppingIdUseCase', () => {
  let itemListRepository: { getAllItemsByShoppingId: jest.Mock };
  let shoppingListRepository: { getListById: jest.Mock };
  let getAllItemsByShoppingIdUseCase: GetAllItemsByShoppingIdUseCase;

  beforeEach(() => {
    itemListRepository = { getAllItemsByShoppingId: jest.fn() };
    shoppingListRepository = { getListById: jest.fn() };
    getAllItemsByShoppingIdUseCase = new GetAllItemsByShoppingIdUseCase(
      itemListRepository,
      shoppingListRepository,
    );
  });

  it('should return all items from a valid shopping list', async () => {
    const mockList = { id: 'list-123', userId: 'user-123', name: 'Groceries' };
    const mockItems = [
      ItemList.reconstitute({
        id: 'i1',
        name: 'Apples',
        status: ItemStatus.Pending,
        quantity: 2,
        amount: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      ItemList.reconstitute({
        id: 'i2',
        name: 'Bananas',
        status: ItemStatus.Done,
        quantity: 5,
        amount: 25,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ];

    shoppingListRepository.getListById.mockResolvedValue(mockList);
    itemListRepository.getAllItemsByShoppingId.mockResolvedValue(mockItems);

    const result = await getAllItemsByShoppingIdUseCase.execute({
      userId: 'user-123',
      shoppingListId: 'list-123',
    });

    expect(shoppingListRepository.getListById).toHaveBeenCalledWith('list-123');
    expect(itemListRepository.getAllItemsByShoppingId).toHaveBeenCalledWith('list-123');
    expect(result).toEqual(mockItems);
  });

  it('should throw InvalidShoppingListId if shoppingListId is missing', async () => {
    await expect(
      getAllItemsByShoppingIdUseCase.execute({ userId: 'user-123', shoppingListId: null }),
    ).rejects.toThrow(InvalidShoppingListId);
  });

  it('should throw ListNotFound if shopping list does not exist', async () => {
    shoppingListRepository.getListById.mockResolvedValue(null);

    await expect(
      getAllItemsByShoppingIdUseCase.execute({ userId: 'user-123', shoppingListId: 'list-999' }),
    ).rejects.toThrow(ListNotFound);
  });

  it('should throw NoPermission if user does not own the shopping list', async () => {
    shoppingListRepository.getListById.mockResolvedValue({
      id: 'list-123',
      userId: 'another-user',
    });

    await expect(
      getAllItemsByShoppingIdUseCase.execute({ userId: 'user-123', shoppingListId: 'list-123' }),
    ).rejects.toThrow(NoPermission);
  });
});
