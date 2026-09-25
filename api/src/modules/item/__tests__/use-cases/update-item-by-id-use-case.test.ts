// @ts-nocheck
import { UpdateItemByIdUseCase } from 'modules/item/application/update-item-by-id/update-item-by-id-use-case';
import { InvalidShoppingListId } from 'modules/item/domain/errors/invalid-shopping-list-id';
import { ListNotFound } from 'modules/shopping/domain/errors/list-not-found';
import { NoPermission } from 'shared/errors/no-permission';
import { ItemNotFound } from 'modules/item/domain/errors/item-not-found';
import { ItemList } from 'modules/item/domain/entities/item-list';
import { ItemStatus } from 'modules/item/domain/value-objects/item-status';

describe('UpdateItemByIdUseCase', () => {
  let itemListRepository: { getItemById: jest.Mock; updateItemById: jest.Mock };
  let shoppingListRepository: { getListById: jest.Mock };
  let updateItemByIdUseCase: UpdateItemByIdUseCase;

  beforeEach(() => {
    itemListRepository = { getItemById: jest.fn(), updateItemById: jest.fn() };
    shoppingListRepository = { getListById: jest.fn() };
    updateItemByIdUseCase = new UpdateItemByIdUseCase(itemListRepository, shoppingListRepository);
  });

  it('should update an item successfully', async () => {
    const mockItem = ItemList.reconstitute({
      id: 'item-456',
      name: 'Bread',
      status: ItemStatus.Done,
      quantity: 2,
      amount: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const data = {
      shoppingListId: 'list-123',
      itemId: 'item-456',
      userId: 'user-123',
      name: 'Bread',
      status: ItemStatus.Done,
      quantity: 2,
      amount: 10,
    };

    shoppingListRepository.getListById.mockResolvedValue({ id: 'list-123', userId: 'user-123' });
    itemListRepository.getItemById.mockResolvedValue(mockItem);
    itemListRepository.updateItemById.mockResolvedValue(mockItem);

    const result = await updateItemByIdUseCase.execute(data);

    expect(shoppingListRepository.getListById).toHaveBeenCalledWith('list-123');
    expect(itemListRepository.getItemById).toHaveBeenCalledWith('item-456', 'list-123');
    expect(itemListRepository.updateItemById).toHaveBeenCalledWith({
      itemId: 'item-456',
      name: 'Bread',
      status: ItemStatus.Done,
      amount: 10,
      quantity: 2,
    });
    expect(result).toEqual(mockItem);
  });

  it('should throw InvalidShoppingListId if shoppingListId is missing', async () => {
    await expect(
      updateItemByIdUseCase.execute({ shoppingListId: null, userId: 'user-123' }),
    ).rejects.toThrow(InvalidShoppingListId);
  });

  it('should throw ListNotFound if list does not exist', async () => {
    shoppingListRepository.getListById.mockResolvedValue(null);

    await expect(
      updateItemByIdUseCase.execute({
        shoppingListId: 'list-123',
        itemId: 'item-456',
        userId: 'user-123',
      }),
    ).rejects.toThrow(ListNotFound);
  });

  it('should throw NoPermission if userId does not match', async () => {
    shoppingListRepository.getListById.mockResolvedValue({ id: 'list-123', userId: 'other-user' });

    await expect(
      updateItemByIdUseCase.execute({
        shoppingListId: 'list-123',
        itemId: 'item-456',
        userId: 'user-123',
      }),
    ).rejects.toThrow(NoPermission);
  });

  it('should throw ItemNotFound if item does not exist', async () => {
    shoppingListRepository.getListById.mockResolvedValue({ id: 'list-123', userId: 'user-123' });
    itemListRepository.getItemById.mockResolvedValue(null);

    await expect(
      updateItemByIdUseCase.execute({
        shoppingListId: 'list-123',
        itemId: 'item-456',
        userId: 'user-123',
      }),
    ).rejects.toThrow(ItemNotFound);
  });
});
