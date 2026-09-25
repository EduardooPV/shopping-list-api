// @ts-nocheck
import { GetAllItemsByShoppingIdUseCase } from 'modules/item/application/get-all-items-by-shopping-id/get-all-items-by-shopping-id-use-case';
import { InvalidShoppingListId } from 'modules/item/domain/errors/invalid-shopping-list-id';
import { ListNotFound } from 'modules/shopping/domain/errors/list-not-found';
import { NoPermission } from 'shared/errors/no-permission';
import { PostgresItemListRepository } from 'modules/item/infrastructure/database/postgres-item-list-repository';
import { PostgresShoppingListRepository } from 'modules/shopping/infrastructure/database/postgres-shopping-list-repository';
import { ItemList } from 'modules/item/domain/entities/item-list';

describe('GetAllItemsByShoppingIdUseCase', () => {
  let itemListRepository: { getAllItemsByShoppingId: jest.Mock };
  let shoppingListRepository: { getListById: jest.Mock };
  let getAllItemsByShoppingIdUseCase: GetAllItemsByShoppingIdUseCase;

  beforeEach(() => {
    itemListRepository = { getAllItemsByShoppingId: jest.fn() };
    shoppingListRepository = { getListById: jest.fn() };

    getAllItemsByShoppingIdUseCase = new GetAllItemsByShoppingIdUseCase(
      itemListRepository as unknown as PostgresItemListRepository,
      shoppingListRepository as unknown as PostgresShoppingListRepository,
    );
  });

  it('should return all items from a valid shopping list', async () => {
    const mockList = { id: 'list-123', userId: 'user-123', name: 'Groceries' };
    const mockItems = [
      new ItemList('Apples', 'pending', 2, 10, new Date(), new Date()),
      new ItemList('Bananas', 'done', 5, 25, new Date(), new Date()),
    ];

    shoppingListRepository.getListById.mockResolvedValue(mockList);
    itemListRepository.getAllItemsByShoppingId.mockResolvedValue(mockItems);

    const result = await getAllItemsByShoppingIdUseCase.execute({
      userId: 'user-123',
      shoppingListId: 'list-123',
    });

    expect(shoppingListRepository.getListById).toHaveBeenCalledWith('list-123');
    expect(itemListRepository.getAllItemsByShoppingId).toHaveBeenCalledWith({
      shoppingListId: 'list-123',
    });
    expect(result).toEqual(mockItems);
  });

  it('should throw InvalidShoppingListId if shoppingListId is missing', async () => {
    await expect(
      getAllItemsByShoppingIdUseCase.execute({
        userId: 'user-123',
        shoppingListId: null,
      }),
    ).rejects.toThrow(InvalidShoppingListId);
  });

  it('should throw ListNotFound if shopping list does not exist', async () => {
    shoppingListRepository.getListById.mockResolvedValue(null);

    await expect(
      getAllItemsByShoppingIdUseCase.execute({
        userId: 'user-123',
        shoppingListId: 'list-999',
      }),
    ).rejects.toThrow(ListNotFound);
  });

  it('should throw NoPermission if user does not own the shopping list', async () => {
    shoppingListRepository.getListById.mockResolvedValue({
      id: 'list-123',
      userId: 'another-user',
    });

    await expect(
      getAllItemsByShoppingIdUseCase.execute({
        userId: 'user-123',
        shoppingListId: 'list-123',
      }),
    ).rejects.toThrow(NoPermission);
  });
});
