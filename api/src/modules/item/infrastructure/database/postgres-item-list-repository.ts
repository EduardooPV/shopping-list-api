import { prisma } from 'core/database/prisma-client';
import { ItemList } from 'modules/item/domain/entities/item-list';
import { IItemList } from 'modules/item/domain/repositories/item-list-repository';
import { ItemStatus } from 'modules/item/domain/value-objects/item-status';

class PostgresItemListRepository implements IItemList {
  async create(data: ItemList, shoppingListId: string): Promise<ItemList> {
    const created = await prisma.itemList.create({
      data: {
        id: data.id,
        name: data.name,
        status: data.status,
        shoppingListId,
        amount: data.amount,
        quantity: data.quantity,
      },
    });
    return ItemList.reconstitute(created);
  }

  async getAllItemsByShoppingId(shoppingListId: string): Promise<ItemList[]> {
    const items = await prisma.itemList.findMany({ where: { shoppingListId } });
    return items.map(ItemList.reconstitute);
  }

  async deleteItemById(itemId: string, shoppingListId: string): Promise<void> {
    await prisma.itemList.delete({ where: { id: itemId, shoppingListId } });
  }

  async getItemById(itemId: string, shoppingListId: string): Promise<ItemList | null> {
    const data = await prisma.itemList.findUnique({
      where: { id: itemId, shoppingListId },
    });
    return data ? ItemList.reconstitute(data) : null;
  }

  async updateItemById(data: {
    itemId: string;
    name?: string;
    status?: ItemStatus;
    amount?: number;
    quantity?: number;
  }): Promise<ItemList> {
    const updated = await prisma.itemList.update({
      where: { id: data.itemId },
      data: {
        name: data.name,
        status: data.status,
        amount: data.amount,
        quantity: data.quantity,
      },
    });
    return ItemList.reconstitute(updated);
  }
}

export { PostgresItemListRepository };
