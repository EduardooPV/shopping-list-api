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
    const created = await prisma.shoppingList.create({
      data: {
        id: data.id,
        userId: data.userId,
        name: data.name,
      },
    });
    return ShoppingList.reconstitute(created);
  }

  async getListById(id?: string): Promise<ShoppingList | null> {
    const data = await prisma.shoppingList.findUnique({ where: { id } });
    return data ? ShoppingList.reconstitute(data) : null;
  }

  async getAllLists({
    page = 1,
    perPage = 10,
    userId,
  }: IGetAllListsRequestDTO): Promise<IPaginatedResponse<ShoppingList>> {
    const skip = (page - 1) * perPage;

    const [lists, total] = await Promise.all([
      prisma.shoppingList.findMany({ where: { userId }, skip, take: perPage }),
      prisma.shoppingList.count({ where: { userId } }),
    ]);

    return Pagination.build({
      items: lists.map(ShoppingList.reconstitute),
      total,
      page,
      perPage,
    });
  }

  async deleteListById(data: IDeleteListByIdDTO): Promise<void> {
    await prisma.shoppingList.delete({ where: { id: data.id, userId: data.userId } });
  }

  async updateListById(data: IUpdateListByIdDTO): Promise<ShoppingList> {
    const updated = await prisma.shoppingList.update({
      where: { id: data.listId, userId: data.userId },
      data: { name: data.name },
    });
    return ShoppingList.reconstitute(updated);
  }
}

export { PostgresShoppingListRepository };
