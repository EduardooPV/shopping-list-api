// @ts-nocheck
import { UpdateListByIdUseCase } from 'modules/shopping/application/update-list-by-id/update-list-by-id-use-case';
import { InvalidListName } from 'modules/shopping/domain/errors/invalid-list-name';
import { ListNotFound } from 'modules/shopping/domain/errors/list-not-found';
import { ShoppingList } from 'modules/shopping/domain/entities/shopping-list';
import { IShoppingList } from 'modules/shopping/domain/repositories/shopping-list-repository';

describe('UpdateListByIdUseCase', () => {
  let shoppingListRepository: { getListById: jest.Mock; updateListById: jest.Mock };
  let updateListByIdUseCase: UpdateListByIdUseCase;

  const now = new Date();

  beforeEach(() => {
    shoppingListRepository = {
      getListById: jest.fn(),
      updateListById: jest.fn(),
    };
    updateListByIdUseCase = new UpdateListByIdUseCase(
      shoppingListRepository as unknown as IShoppingList,
    );
  });

  it('should update a shopping list successfully', async () => {
    const mockList = ShoppingList.reconstitute({
      id: 'list-123',
      userId: 'user-123',
      name: 'Groceries',
      createdAt: now,
      updatedAt: now,
    });
    const updatedList = ShoppingList.reconstitute({
      id: 'list-123',
      userId: 'user-123',
      name: 'Updated Groceries',
      createdAt: now,
      updatedAt: now,
    });

    shoppingListRepository.getListById.mockResolvedValue(mockList);
    shoppingListRepository.updateListById.mockResolvedValue(updatedList);

    const result = await updateListByIdUseCase.execute({
      listId: 'list-123',
      name: 'Updated Groceries',
      userId: 'user-123',
    });

    expect(shoppingListRepository.getListById).toHaveBeenCalledWith('list-123');
    expect(shoppingListRepository.updateListById).toHaveBeenCalledWith({
      listId: 'list-123',
      name: 'Updated Groceries',
      userId: 'user-123',
    });
    expect(result).toEqual(updatedList);
  });

  it('should throw ListNotFound if list does not exist', async () => {
    shoppingListRepository.getListById.mockResolvedValue(null);

    await expect(
      updateListByIdUseCase.execute({ listId: 'list-999', name: 'New Name', userId: 'user-123' }),
    ).rejects.toThrow(ListNotFound);
  });

  it('should throw InvalidListName if name is missing', async () => {
    const mockList = ShoppingList.reconstitute({
      id: 'list-123',
      userId: 'user-123',
      name: 'Groceries',
      createdAt: now,
      updatedAt: now,
    });
    shoppingListRepository.getListById.mockResolvedValue(mockList);

    await expect(
      updateListByIdUseCase.execute({ listId: 'list-123', name: '   ', userId: 'user-123' }),
    ).rejects.toThrow(InvalidListName);
  });

  it('should handle repository errors', async () => {
    shoppingListRepository.getListById.mockRejectedValue(new Error('Database error'));

    await expect(
      updateListByIdUseCase.execute({
        listId: 'list-123',
        name: 'Updated Groceries',
        userId: 'user-123',
      }),
    ).rejects.toThrow('Database error');
  });
});
