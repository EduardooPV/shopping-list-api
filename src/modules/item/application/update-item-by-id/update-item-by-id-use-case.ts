import { ItemList } from 'modules/item/domain/entities/item-list';
import { InvalidShoppingListId } from 'modules/item/domain/errors/invalid-shopping-list-id';
import { PostgresItemListRepository } from 'modules/item/infrastructure/database/postgres-item-list-repository';
import { IUpdateItemByIdRequestDTO } from './update-item-by-id-dto';
import { ListNotFound } from 'modules/shopping/domain/errors/list-not-found';
import { NoPermission } from 'shared/errors/no-permission';
import { ItemNotFound } from 'modules/item/domain/errors/item-not-found';
import { IShoppingList } from 'modules/shopping/domain/repositories/shopping-list-repository';

class UpdateItemByIdUseCase {
  constructor(
    private itemListRepository: PostgresItemListRepository,
    private shoppingListRepository: IShoppingList,
  ) {}

  async execute(data: IUpdateItemByIdRequestDTO): Promise<ItemList> {
    if (data.shoppingListId == null) throw new InvalidShoppingListId();

    const shoppingListExist = await this.shoppingListRepository.getListById(data.shoppingListId);

    if (!shoppingListExist) {
      throw new ListNotFound();
    }

    if (shoppingListExist.userId !== data.userId) {
      throw new NoPermission();
    }

    const itemExist = await this.itemListRepository.getItemById({
      shoppingListId: data.shoppingListId,
      itemId: data.itemId,
    });

    if (itemExist === null) throw new ItemNotFound();

    return await this.itemListRepository.updateItemById(data);
  }
}

export { UpdateItemByIdUseCase };
