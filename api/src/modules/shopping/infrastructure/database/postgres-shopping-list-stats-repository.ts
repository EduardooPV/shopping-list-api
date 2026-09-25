import { prisma } from 'core/database/prisma-client';
import { IShoppingListStats } from 'modules/shopping/domain/repositories/shopping-list-stats-repository';
import { ItemStatus } from 'modules/item/domain/value-objects/item-status';

class PostgresShoppingListStatsRespository implements IShoppingListStats {
  async getSumAmountItemsById(shoppingListId?: string): Promise<number> {
    const result = await prisma.itemList.aggregate({
      where: { shoppingListId },
      _sum: { amount: true },
    });
    return result._sum?.amount ?? 0;
  }

  async getDoneItemsById(shoppingListId?: string): Promise<number> {
    return prisma.itemList.count({
      where: { shoppingListId, status: ItemStatus.Done },
    });
  }

  async getPendingItemsById(shoppingListId?: string): Promise<number> {
    return prisma.itemList.count({
      where: { shoppingListId, status: ItemStatus.Pending },
    });
  }
}

export { PostgresShoppingListStatsRespository };
