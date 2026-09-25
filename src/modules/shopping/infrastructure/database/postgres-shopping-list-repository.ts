import { prisma } from 'core/database/prisma-client';
import { ShoppingList } from 'modules/shopping/domain/entities/shopping-list';
import { IShoppingList } from 'modules/shopping/domain/repositories/shopping-list-repository';
import { IGetAllListsRequestDTO } from 'modules/shopping/application/get-all-lists/get-all-lists-dto';
import { IDeleteListByIdDTO } from 'modules/shopping/application/delete-list-by-id/delete-list-by-id-dto';
import { IUpdateListByIdDTO } from 'modules/shopping/application/update-list-by-id/update-list-by-id-dto';
import { IPaginatedResponse } from 'shared/interfaces/paginated-response';
import { Pagination } from 'shared/utils/pagination-response';

class PostgresShoppingListRepository implements IShoppingList {
  async create(data: ShoppingList): Promise<ShoppingList> {
    return await prisma.shoppingList.create({
      data: {
        userId: data.userId,
        name: data.name,
        id: data.id,
      },
    });
  }

  async getListById(id?: string): Promise<ShoppingList | null> {
    return await prisma.shoppingList.findUnique({
      where: {
        id,
      },
    });
  }

  async getAllLists({
    page = 1,
    perPage = 10,
    userId,
  }: IGetAllListsRequestDTO): Promise<IPaginatedResponse<ShoppingList>> {
    const skip = (page - 1) * perPage;

    const [lists, total] = await Promise.all([
      prisma.shoppingList.findMany({
        where: {
          userId: userId,
        },
        skip,
        take: perPage,
      }),
      prisma.shoppingList.count({
        where: { userId },
      }),
    ]);

    return Pagination.build({ items: lists, total, page, perPage });
  }

  async deleteListById(data: IDeleteListByIdDTO): Promise<void> {
    await prisma.shoppingList.delete({
      where: {
        userId: data.userId,
        id: data.id,
      },
    });
  }

  async updateListById(data: IUpdateListByIdDTO): Promise<ShoppingList> {
    return await prisma.shoppingList.update({
      where: {
        id: data.listId,
        userId: data.userId,
      },
      data: {
        name: data.name,
      },
    });
  }

  async getSumAmountItemsById(shoppingListId?: string): Promise<number> {
    const result = await prisma.itemList.aggregate({
      where: {
        shoppingListId,
      },
      _sum: {
        amount: true,
      },
    });

    return result._sum?.amount ?? 0;
  }

  async getDoneItemsById(shoppingListId?: string): Promise<number> {
    return await prisma.itemList.count({
      where: {
        shoppingListId,
        status: 'done',
      },
    });
  }

  async getPendingItemsById(shoppingListId?: string): Promise<number> {
    return await prisma.itemList.count({
      where: {
        shoppingListId,
        status: 'pending',
      },
    });
  }
}

export { PostgresShoppingListRepository };
