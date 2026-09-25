import { ItemList } from 'modules/item/domain/entities/item-list';
import { InvalidShoppingListId } from 'modules/item/domain/errors/invalid-shopping-list-id';
import { IItemList } from 'modules/item/domain/repositories/item-list-repository';
import { IGetAllItemsByShoppingIdDTO } from './get-all-items-by-shopping-id-dto';
import { ListNotFound } from 'modules/shopping/domain/errors/list-not-found';
import { NoPermission } from 'shared/errors/no-permission';
import { IShoppingList } from 'modules/shopping/domain/repositories/shopping-list-repository';

class GetAllItemsByShoppingIdUseCase {
  constructor(
    private itemListRepository: IItemList,
    private shoppingListRepository: IShoppingList,
  ) {}

  async execute(data: IGetAllItemsByShoppingIdDTO): Promise<ItemList[]> {
    if (data.shoppingListId == null) throw new InvalidShoppingListId();

    const shoppingListExist = await this.shoppingListRepository.getListById(data.shoppingListId);

    if (!shoppingListExist) {
      throw new ListNotFound();
    }

    if (shoppingListExist.userId !== data.userId) {
      throw new NoPermission();
    }

    return await this.itemListRepository.getAllItemsByShoppingId({
      shoppingListId: data.shoppingListId,
    });
  }
}

export { GetAllItemsByShoppingIdUseCase };
