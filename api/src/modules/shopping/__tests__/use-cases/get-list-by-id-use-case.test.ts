// @ts-nocheck
import { GetListByIdUseCase } from 'modules/shopping/application/get-list-by-id/get-list-by-id-use-case';
import { ShoppingList } from 'modules/shopping/domain/entities/shopping-list';
import { InvalidListId } from 'modules/shopping/domain/errors/invalid-list-id';
import { ListNotFound } from 'modules/shopping/domain/errors/list-not-found';

describe('GetListByIdUseCase', () => {
  let shoppingListRepository: { getListById: jest.Mock };
  let getListByIdUseCase: GetListByIdUseCase;

  beforeEach(() => {
    shoppingListRepository = {
      getListById: jest.fn(),
    };

    getListByIdUseCase = new GetListByIdUseCase(shoppingListRepository as unknown);
  });

  it('should return a shopping list when found', async () => {
    const mockList = new ShoppingList('user-123', 'Groceries', new Date(), new Date());
    shoppingListRepository.getListById.mockResolvedValue(mockList);

    const result = await getListByIdUseCase.execute({ id: 'list-123' });

    expect(shoppingListRepository.getListById).toHaveBeenCalledWith('list-123');
    expect(result).toEqual(mockList);
  });

  it('should throw InvalidListId when id is missing', async () => {
    await expect(getListByIdUseCase.execute({ id: undefined })).rejects.toThrow(InvalidListId);
    await expect(getListByIdUseCase.execute({ id: '' })).rejects.toThrow(InvalidListId);
  });

  it('should throw ListNotFound when list does not exist', async () => {
    shoppingListRepository.getListById.mockResolvedValue(null);

    await expect(getListByIdUseCase.execute({ id: 'list-999' })).rejects.toThrow(ListNotFound);
  });

  it('should propagate repository errors', async () => {
    shoppingListRepository.getListById.mockRejectedValue(new Error('Database error'));

    await expect(getListByIdUseCase.execute({ id: 'list-123' })).rejects.toThrow('Database error');
  });
});
