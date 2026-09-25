// @ts-nocheck
import { GetAllListsUseCase } from 'modules/shopping/application/get-all-lists/get-all-lists-use-case';
import { PostgresShoppingListRepository } from 'modules/shopping/infrastructure/database/postgres-shopping-list-repository';
import { ShoppingList } from 'modules/shopping/domain/entities/shopping-list';

describe('GetAllListsUseCase', () => {
  let shoppingListRepository: { getAllLists: jest.Mock };
  let getAllListsUseCase: GetAllListsUseCase;

  beforeEach(() => {
    shoppingListRepository = {
      getAllLists: jest.fn(),
    };

    getAllListsUseCase = new GetAllListsUseCase(
      shoppingListRepository as unknown as PostgresShoppingListRepository,
    );
  });

  it('should return a paginated list of shopping lists', async () => {
    const mockLists = [
      new ShoppingList('user-123', 'Groceries', new Date(), new Date()),
      new ShoppingList('user-123', 'Electronics', new Date(), new Date()),
    ];

    const mockResponse = {
      data: mockLists,
      total: 2,
      page: 1,
      perPage: 10,
    };

    shoppingListRepository.getAllLists.mockResolvedValue(mockResponse);

    const result = await getAllListsUseCase.execute({ userId: 'user-123', page: 1, perPage: 10 });

    expect(shoppingListRepository.getAllLists).toHaveBeenCalledWith({
      userId: 'user-123',
      page: 1,
      perPage: 10,
    });
    expect(result).toEqual(mockResponse);
  });

  it('should handle repository errors', async () => {
    shoppingListRepository.getAllLists.mockRejectedValue(new Error('Database error'));

    await expect(
      getAllListsUseCase.execute({ userId: 'user-123', page: 1, perPage: 10 }),
    ).rejects.toThrow('Database error');
  });
});
