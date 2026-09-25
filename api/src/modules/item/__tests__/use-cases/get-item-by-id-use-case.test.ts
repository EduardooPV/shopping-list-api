// @ts-nocheck
import { GetItemByIdUseCase } from 'modules/item/application/get-item-by-id/get-item-by-id-use-case';
import { InvalidShoppingListId } from 'modules/item/domain/errors/invalid-shopping-list-id';
import { InvalidItemId } from 'modules/item/domain/errors/invalid-item-id';

describe('GetItemByIdUseCase', () => {
  let itemListRepository: { getItemById: jest.Mock };
  let getItemByIdUseCase: GetItemByIdUseCase;

  beforeEach(() => {
    itemListRepository = { getItemById: jest.fn() };
    getItemByIdUseCase = new GetItemByIdUseCase(itemListRepository);
  });

  it('should call repository with correct parameters when valid data is provided', async () => {
    await getItemByIdUseCase.execute({ shoppingListId: 'list-123', itemId: 'item-456' });

    expect(itemListRepository.getItemById).toHaveBeenCalledWith('item-456', 'list-123');
  });

  it('should throw InvalidShoppingListId if shoppingListId is missing', async () => {
    await expect(
      getItemByIdUseCase.execute({ shoppingListId: null, itemId: 'item-456' }),
    ).rejects.toThrow(InvalidShoppingListId);
  });

  it('should throw InvalidItemId if itemId is missing', async () => {
    await expect(
      getItemByIdUseCase.execute({ shoppingListId: 'list-123', itemId: null }),
    ).rejects.toThrow(InvalidItemId);
  });
});
