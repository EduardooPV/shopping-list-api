import { ItemList } from 'modules/item/domain/entities/item-list';
import { ItemStatus } from 'modules/item/domain/value-objects/item-status';
import { InvalidShoppingListId } from 'modules/item/domain/errors/invalid-shopping-list-id';
import { IItemList } from 'modules/item/domain/repositories/item-list-repository';
import { ICreateItemRequestDTO } from './create-item-dto';
import { ListNotFound } from 'modules/shopping/domain/errors/list-not-found';
import { NoPermission } from 'shared/errors/no-permission';
import { IShoppingList } from 'modules/shopping/domain/repositories/shopping-list-repository';

class CreateItemUseCase {
  constructor(
    private itemListRepository: IItemList,
    private shoppingListRepository: IShoppingList,
  ) {}

  async execute(data: ICreateItemRequestDTO): Promise<ItemList> {
    if (data.shoppingListId == null) throw new InvalidShoppingListId();

    const shoppingListExist = await this.shoppingListRepository.getListById(data.shoppingListId);

    if (!shoppingListExist) throw new ListNotFound();

    if (shoppingListExist.userId !== data.userId) throw new NoPermission();

    const item = ItemList.create(
      data.name,
      (data.status as ItemStatus) ?? ItemStatus.Pending,
      data.quantity,
      data.amount,
    );

    return await this.itemListRepository.create(item, data.shoppingListId);
  }
}

export { CreateItemUseCase };
