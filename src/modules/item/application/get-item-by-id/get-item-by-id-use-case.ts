import { InvalidShoppingListId } from 'modules/item/domain/errors/invalid-shopping-list-id';
import { IItemList } from 'modules/item/domain/repositories/item-list-repository';
import { IGetItemByIdDTO } from './get-item-by-id-dto';
import { InvalidItemId } from 'modules/item/domain/errors/invalid-item-id';

class GetItemByIdUseCase {
  constructor(private itemListRepository: IItemList) {}

  async execute(data: IGetItemByIdDTO): Promise<void> {
    if (data.shoppingListId == null) throw new InvalidShoppingListId();
    if (data.itemId == null) throw new InvalidItemId();

    await this.itemListRepository.getItemById(data.itemId, data.shoppingListId);
  }
}

export { GetItemByIdUseCase };
