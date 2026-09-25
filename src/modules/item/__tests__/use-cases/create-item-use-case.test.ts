// @ts-nocheck
import { CreateItemUseCase } from 'modules/item/application/create-item/create-item-use-case';
import { InvalidItemName } from 'modules/item/domain/errors/invalid-item-name';
import { InvalidShoppingListId } from 'modules/item/domain/errors/invalid-shopping-list-id';
import { ListNotFound } from 'modules/shopping/domain/errors/list-not-found';
import { NoPermission } from 'shared/errors/no-permission';
import { ItemList } from 'modules/item/domain/entities/item-list';
import { PostgresItemListRepository } from 'modules/item/infrastructure/database/postgres-item-list-repository';
import { PostgresShoppingListRepository } from 'modules/shopping/infrastructure/database/postgres-shopping-list-repository';

describe('CreateItemUseCase', () => {
  let itemListRepository: { create: jest.Mock };
  let shoppingListRepository: { getListById: jest.Mock };
  let createItemUseCase: CreateItemUseCase;

  beforeEach(() => {
    itemListRepository = { create: jest.fn() };
    shoppingListRepository = { getListById: jest.fn() };

    createItemUseCase = new CreateItemUseCase(
      itemListRepository as unknown as PostgresItemListRepository,
      shoppingListRepository as unknown as PostgresShoppingListRepository,
    );
  });

  it('should create an item successfully', async () => {
    const mockList = { id: 'list-123', userId: 'user-123', name: 'Groceries' };
    const mockItem = new ItemList(
      'item-123',
      'Apples',
      'list-123',
      'user-123',
      new Date(),
      new Date(),
    );

    shoppingListRepository.getListById.mockResolvedValue(mockList);
    itemListRepository.create.mockResolvedValue(mockItem);

    const result = await createItemUseCase.execute({
      userId: 'user-123',
      name: 'Apples',
      shoppingListId: 'list-123',
    });

    expect(shoppingListRepository.getListById).toHaveBeenCalledWith('list-123');
    expect(itemListRepository.create).toHaveBeenCalledWith({
      name: 'Apples',
      shoppingListId: 'list-123',
      userId: 'user-123',
    });
    expect(result).toEqual(mockItem);
  });

  it('should throw InvalidShoppingListId if shoppingListId is missing', async () => {
    await expect(
      createItemUseCase.execute({ userId: 'user-123', name: 'Apples', shoppingListId: null }),
    ).rejects.toThrow(InvalidShoppingListId);
  });

  it('should throw InvalidItemName if name is empty', async () => {
    await expect(
      createItemUseCase.execute({ userId: 'user-123', name: '', shoppingListId: 'list-123' }),
    ).rejects.toThrow(InvalidItemName);
  });

  it('should throw ListNotFound if the shopping list does not exist', async () => {
    shoppingListRepository.getListById.mockResolvedValue(null);

    await expect(
      createItemUseCase.execute({ userId: 'user-123', name: 'Apples', shoppingListId: 'list-123' }),
    ).rejects.toThrow(ListNotFound);
  });

  it('should throw NoPermission if user does not own the shopping list', async () => {
    shoppingListRepository.getListById.mockResolvedValue({
      id: 'list-123',
      userId: 'another-user',
    });

    await expect(
      createItemUseCase.execute({ userId: 'user-123', name: 'Apples', shoppingListId: 'list-123' }),
    ).rejects.toThrow(NoPermission);
  });

  it('should trim whitespace from item name before creating', async () => {
    const mockList = { id: 'list-123', userId: 'user-123', name: 'Groceries' };
    const mockItem = new ItemList(
      'item-123',
      'Apples',
      'list-123',
      'user-123',
      new Date(),
      new Date(),
    );

    shoppingListRepository.getListById.mockResolvedValue(mockList);
    itemListRepository.create.mockResolvedValue(mockItem);

    const result = await createItemUseCase.execute({
      userId: 'user-123',
      name: '   Apples   ',
      shoppingListId: 'list-123',
    });

    expect(itemListRepository.create).toHaveBeenCalledWith({
      name: 'Apples',
      shoppingListId: 'list-123',
      userId: 'user-123',
    });
    expect(result).toEqual(mockItem);
  });
});
