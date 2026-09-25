import { ItemList } from 'modules/item/domain/entities/item-list';
import { ItemStatus } from 'modules/item/domain/value-objects/item-status';

interface IItemList {
  create(data: ItemList, shoppingListId: string): Promise<ItemList>;
  getAllItemsByShoppingId(shoppingListId: string): Promise<ItemList[]>;
  deleteItemById(itemId: string, shoppingListId: string): Promise<void>;
  getItemById(itemId: string, shoppingListId: string): Promise<ItemList | null>;
  updateItemById(data: {
    itemId: string;
    name?: string;
    status?: ItemStatus;
    amount?: number;
    quantity?: number;
  }): Promise<ItemList>;
}

export { IItemList };
