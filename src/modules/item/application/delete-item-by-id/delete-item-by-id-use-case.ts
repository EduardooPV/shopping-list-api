import { InvalidShoppingListId } from 'modules/item/domain/errors/invalid-shopping-list-id';
import { PostgresItemListRepository } from 'modules/item/infrastructure/database/postgres-item-list-repository';
import { IDeleteItemByIdDTO } from './delete-item-by-id-dto';
import { InvalidItemId } from 'modules/item/domain/errors/invalid-item-id';
import { ItemNotFound } from 'modules/item/domain/errors/item-not-found';
import { ListNotFound } from 'modules/shopping/domain/errors/list-not-found';
import { NoPermission } from 'shared/errors/no-permission';
import { IShoppingList } from 'modules/shopping/domain/repositories/shopping-list-repository';

class DeleteItemByIdUseCase {
  constructor(
    private itemListRepository: PostgresItemListRepository,
    private shoppingListRepository: IShoppingList,
  ) {}

  async execute(data: IDeleteItemByIdDTO): Promise<void> {
    if (data.shoppingListId == null) throw new InvalidShoppingListId();

    if (data.itemId == null) throw new InvalidItemId();

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

    await this.itemListRepository.deleteItemById(data);
  }
}

export { DeleteItemByIdUseCase };
