// @ts-nocheck
import { DeleteItemByIdUseCase } from 'modules/item/application/delete-item-by-id/delete-item-by-id-use-case';
import { InvalidShoppingListId } from 'modules/item/domain/errors/invalid-shopping-list-id';
import { InvalidItemId } from 'modules/item/domain/errors/invalid-item-id';
import { ItemNotFound } from 'modules/item/domain/errors/item-not-found';
import { ListNotFound } from 'modules/shopping/domain/errors/list-not-found';
import { NoPermission } from 'shared/errors/no-permission';

describe('DeleteItemByIdUseCase', () => {
  let itemListRepository: { getItemById: jest.Mock; deleteItemById: jest.Mock };
  let shoppingListRepository: { getListById: jest.Mock };
  let deleteItemByIdUseCase: DeleteItemByIdUseCase;

  beforeEach(() => {
    itemListRepository = { getItemById: jest.fn(), deleteItemById: jest.fn() };
    shoppingListRepository = { getListById: jest.fn() };
    deleteItemByIdUseCase = new DeleteItemByIdUseCase(itemListRepository, shoppingListRepository);
  });

  it('should delete an item successfully', async () => {
    const mockList = { id: 'list-123', userId: 'user-123', name: 'Groceries' };
    const mockItem = { id: 'item-123', name: 'Apples' };

    shoppingListRepository.getListById.mockResolvedValue(mockList);
    itemListRepository.getItemById.mockResolvedValue(mockItem);
    itemListRepository.deleteItemById.mockResolvedValue(undefined);

    await deleteItemByIdUseCase.execute({
      userId: 'user-123',
      shoppingListId: 'list-123',
      itemId: 'item-123',
    });

    expect(shoppingListRepository.getListById).toHaveBeenCalledWith('list-123');
    expect(itemListRepository.getItemById).toHaveBeenCalledWith('item-123', 'list-123');
    expect(itemListRepository.deleteItemById).toHaveBeenCalledWith('item-123', 'list-123');
  });

  it('should throw InvalidShoppingListId if shoppingListId is missing', async () => {
    await expect(
      deleteItemByIdUseCase.execute({
        userId: 'user-123',
        shoppingListId: null,
        itemId: 'item-123',
      }),
    ).rejects.toThrow(InvalidShoppingListId);
  });

  it('should throw InvalidItemId if itemId is missing', async () => {
    await expect(
      deleteItemByIdUseCase.execute({
        userId: 'user-123',
        shoppingListId: 'list-123',
        itemId: null,
      }),
    ).rejects.toThrow(InvalidItemId);
  });

  it('should throw ListNotFound if shopping list does not exist', async () => {
    shoppingListRepository.getListById.mockResolvedValue(null);

    await expect(
      deleteItemByIdUseCase.execute({
        userId: 'user-123',
        shoppingListId: 'list-123',
        itemId: 'item-123',
      }),
    ).rejects.toThrow(ListNotFound);
  });

  it('should throw NoPermission if user does not own the shopping list', async () => {
    shoppingListRepository.getListById.mockResolvedValue({
      id: 'list-123',
      userId: 'another-user',
    });

    await expect(
      deleteItemByIdUseCase.execute({
        userId: 'user-123',
        shoppingListId: 'list-123',
        itemId: 'item-123',
      }),
    ).rejects.toThrow(NoPermission);
  });

  it('should throw ItemNotFound if item does not exist in the list', async () => {
    shoppingListRepository.getListById.mockResolvedValue({ id: 'list-123', userId: 'user-123' });
    itemListRepository.getItemById.mockResolvedValue(null);

    await expect(
      deleteItemByIdUseCase.execute({
        userId: 'user-123',
        shoppingListId: 'list-123',
        itemId: 'item-123',
      }),
    ).rejects.toThrow(ItemNotFound);
  });
});
