import { prisma } from 'core/database/prisma-client';
import { IShoppingListStats } from 'modules/shopping/domain/repositories/shopping-list-stats-repository';

class PostgresShoppingListStatsRespository implements IShoppingListStats {
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

export { PostgresShoppingListStatsRespository };
