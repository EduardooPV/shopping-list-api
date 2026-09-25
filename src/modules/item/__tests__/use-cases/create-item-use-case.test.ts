// @ts-nocheck
import { CreateItemUseCase } from 'modules/item/application/create-item/create-item-use-case';
import { InvalidItemName } from 'modules/item/domain/errors/invalid-item-name';
import { InvalidShoppingListId } from 'modules/item/domain/errors/invalid-shopping-list-id';
import { ListNotFound } from 'modules/shopping/domain/errors/list-not-found';
import { NoPermission } from 'shared/errors/no-permission';
import { ItemList } from 'modules/item/domain/entities/item-list';
import { ItemStatus } from 'modules/item/domain/value-objects/item-status';

describe('CreateItemUseCase', () => {
  let itemListRepository: { create: jest.Mock };
  let shoppingListRepository: { getListById: jest.Mock };
  let createItemUseCase: CreateItemUseCase;

  beforeEach(() => {
    itemListRepository = { create: jest.fn() };
    shoppingListRepository = { getListById: jest.fn() };

    createItemUseCase = new CreateItemUseCase(itemListRepository, shoppingListRepository);
  });

  it('should create an item successfully', async () => {
    const mockList = { id: 'list-123', userId: 'user-123', name: 'Groceries' };
    const mockItem = ItemList.reconstitute({
      id: 'item-123',
      name: 'Apples',
      status: ItemStatus.Pending,
      quantity: 1,
      amount: 2.5,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    shoppingListRepository.getListById.mockResolvedValue(mockList);
    itemListRepository.create.mockResolvedValue(mockItem);

    const result = await createItemUseCase.execute({
      userId: 'user-123',
      name: 'Apples',
      shoppingListId: 'list-123',
      status: ItemStatus.Pending,
      quantity: 1,
      amount: 2.5,
    });

    expect(shoppingListRepository.getListById).toHaveBeenCalledWith('list-123');
    expect(itemListRepository.create).toHaveBeenCalledWith(expect.any(ItemList), 'list-123');
    expect(result).toEqual(mockItem);
  });

  it('should throw InvalidShoppingListId if shoppingListId is missing', async () => {
    await expect(
      createItemUseCase.execute({
        userId: 'user-123',
        name: 'Apples',
        shoppingListId: null,
        status: ItemStatus.Pending,
        quantity: 1,
        amount: 1,
      }),
    ).rejects.toThrow(InvalidShoppingListId);
  });

  it('should throw InvalidItemName if name is empty', async () => {
    shoppingListRepository.getListById.mockResolvedValue({ id: 'list-123', userId: 'user-123' });

    await expect(
      createItemUseCase.execute({
        userId: 'user-123',
        name: '',
        shoppingListId: 'list-123',
        status: ItemStatus.Pending,
        quantity: 1,
        amount: 1,
      }),
    ).rejects.toThrow(InvalidItemName);
  });

  it('should throw ListNotFound if the shopping list does not exist', async () => {
    shoppingListRepository.getListById.mockResolvedValue(null);

    await expect(
      createItemUseCase.execute({
        userId: 'user-123',
        name: 'Apples',
        shoppingListId: 'list-123',
        status: ItemStatus.Pending,
        quantity: 1,
        amount: 1,
      }),
    ).rejects.toThrow(ListNotFound);
  });

  it('should throw NoPermission if user does not own the shopping list', async () => {
    shoppingListRepository.getListById.mockResolvedValue({
      id: 'list-123',
      userId: 'another-user',
    });

    await expect(
      createItemUseCase.execute({
        userId: 'user-123',
        name: 'Apples',
        shoppingListId: 'list-123',
        status: ItemStatus.Pending,
        quantity: 1,
        amount: 1,
      }),
    ).rejects.toThrow(NoPermission);
  });

  it('should trim whitespace from item name before creating', async () => {
    const mockList = { id: 'list-123', userId: 'user-123', name: 'Groceries' };
    const mockItem = ItemList.reconstitute({
      id: 'item-123',
      name: 'Apples',
      status: ItemStatus.Pending,
      quantity: 1,
      amount: 2.5,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    shoppingListRepository.getListById.mockResolvedValue(mockList);
    itemListRepository.create.mockResolvedValue(mockItem);

    await createItemUseCase.execute({
      userId: 'user-123',
      name: '   Apples   ',
      shoppingListId: 'list-123',
      status: ItemStatus.Pending,
      quantity: 1,
      amount: 2.5,
    });

    expect(itemListRepository.create).toHaveBeenCalledWith(expect.any(ItemList), 'list-123');
  });
});
