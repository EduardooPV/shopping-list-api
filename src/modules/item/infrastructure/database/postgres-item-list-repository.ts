import { prisma } from 'core/database/prisma-client';
import { ItemList } from 'modules/item/domain/entities/item-list';
import { IItemList } from 'modules/item/domain/repositories/item-list-repository';
import { IGetAllItemsByShoppingIdDTO } from 'modules/item/application/get-all-items-by-shopping-id/get-all-items-by-shopping-id-dto';
import { IDeleteItemByIdDTO } from 'modules/item/application/delete-item-by-id/delete-item-by-id-dto';
import { IGetItemByIdDTO } from 'modules/item/application/get-item-by-id/get-item-by-id-dto';
import { IUpdateItemByIdDTO } from '../../application/update-item-by-id/update-item-by-id-dto';

class PostgresItemListRepository implements IItemList {
  async create(data: ItemList, shoppingListId: string): Promise<ItemList> {
    return await prisma.itemList.create({
      data: {
        name: data.name,
        status: data.status,
        shoppingListId: shoppingListId,
        amount: data.amount,
        quantity: data.quantity,
        id: data.id,
      },
    });
  }

  async getAllItemsByShoppingId(data: IGetAllItemsByShoppingIdDTO): Promise<ItemList[]> {
    return await prisma.itemList.findMany({
      where: {
        shoppingListId: data.shoppingListId,
      },
    });
  }

  async deleteItemById(data: IDeleteItemByIdDTO): Promise<void> {
    await prisma.itemList.delete({
      where: {
        id: data.itemId,
        shoppingListId: data.shoppingListId,
      },
    });
  }

  async getItemById(data: IGetItemByIdDTO): Promise<ItemList | null> {
    return await prisma.itemList.findUnique({
      where: {
        shoppingListId: data.shoppingListId,
        id: data.itemId,
      },
    });
  }

  async updateItemById(data: IUpdateItemByIdDTO): Promise<ItemList> {
    return await prisma.itemList.update({
      where: {
        id: data.itemId,
      },
      data: {
        name: data.name,
        status: data.status,
        amount: data.amount,
        quantity: data.quantity,
      },
    });
  }
}
export { PostgresItemListRepository };
