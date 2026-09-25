// @ts-nocheck
import { CreateListUseCase } from 'modules/shopping/application/create-list/create-list-use-case';
import { InvalidListName } from 'modules/shopping/domain/errors/invalid-list-name';
import { InvalidUserIdError } from 'modules/users/domain/errors/invalid-user-id-error';
import { PostgresShoppingListRepository } from 'modules/shopping/infrastructure/database/postgres-shopping-list-repository';
import { ShoppingList } from 'modules/shopping/domain/entities/shopping-list';

describe('CreateListUseCase', () => {
  let shoppingListRepository: { create: jest.Mock };
  let createListUseCase: CreateListUseCase;

  beforeEach(() => {
    shoppingListRepository = { create: jest.fn() };
    createListUseCase = new CreateListUseCase(
      shoppingListRepository as unknown as PostgresShoppingListRepository,
    );
  });

  it('should create a list successfully', async () => {
    const mockList = new ShoppingList('user-123', 'Groceries', new Date(), new Date());
    shoppingListRepository.create.mockResolvedValue(mockList);

    const result = await createListUseCase.execute({ userId: 'user-123', name: 'Groceries' });

    expect(shoppingListRepository.create).toHaveBeenCalledWith({
      userId: 'user-123',
      name: 'Groceries',
    });
    expect(result).toEqual(mockList);
  });

  it('should throw InvalidUserIdError if userId is missing', async () => {
    await expect(createListUseCase.execute({ userId: null, name: 'Groceries' })).rejects.toThrow(
      InvalidUserIdError,
    );
  });

  it('should throw InvalidListName if name is missing', async () => {
    await expect(createListUseCase.execute({ userId: 'user-123', name: '' })).rejects.toThrow(
      InvalidListName,
    );
  });

  it('should trim whitespace from the list name before creating', async () => {
    const mockList = new ShoppingList('user-123', 'Groceries', new Date(), new Date());
    shoppingListRepository.create.mockResolvedValue(mockList);

    const result = await createListUseCase.execute({ userId: 'user-123', name: '   Groceries   ' });

    expect(shoppingListRepository.create).toHaveBeenCalledWith({
      userId: 'user-123',
      name: 'Groceries',
    });
    expect(result).toEqual(mockList);
  });
});
