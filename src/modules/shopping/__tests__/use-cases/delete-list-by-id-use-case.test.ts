// @ts-nocheck
import { DeleteListByIdUseCase } from 'modules/shopping/application/delete-list-by-id/delete-list-by-id-use-case';
import { InvalidUserIdError } from 'modules/users/domain/errors/invalid-user-id-error';
import { ListNotFound } from 'modules/shopping/domain/errors/list-not-found';
import { PostgresShoppingListRepository } from 'modules/shopping/infrastructure/database/postgres-shopping-list-repository';

describe('DeleteListByIdUseCase', () => {
  let shoppingListRepository: {
    getListById: jest.Mock;
    deleteListById: jest.Mock;
  };
  let deleteListByIdUseCase: DeleteListByIdUseCase;

  beforeEach(() => {
    shoppingListRepository = {
      getListById: jest.fn(),
      deleteListById: jest.fn(),
    };

    deleteListByIdUseCase = new DeleteListByIdUseCase(
      shoppingListRepository as unknown as PostgresShoppingListRepository,
    );
  });

  it('should delete a list successfully', async () => {
    shoppingListRepository.getListById.mockResolvedValue({ id: 'list-123', userId: 'user-123' });
    shoppingListRepository.deleteListById.mockResolvedValue(undefined);

    await deleteListByIdUseCase.execute({ id: 'list-123', userId: 'user-123' });

    expect(shoppingListRepository.getListById).toHaveBeenCalledWith('list-123');
    expect(shoppingListRepository.deleteListById).toHaveBeenCalledWith({
      id: 'list-123',
      userId: 'user-123',
    });
  });

  it('should throw InvalidUserIdError if userId is missing', async () => {
    await expect(deleteListByIdUseCase.execute({ id: 'list-123', userId: null })).rejects.toThrow(
      InvalidUserIdError,
    );
  });

  it('should throw ListNotFound if list does not exist', async () => {
    shoppingListRepository.getListById.mockResolvedValue(null);

    await expect(
      deleteListByIdUseCase.execute({ id: 'list-123', userId: 'user-123' }),
    ).rejects.toThrow(ListNotFound);
  });
});
