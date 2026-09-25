import { InvalidUserIdError } from 'modules/users/domain/errors/invalid-user-id-error';
import { ListNotFound } from 'modules/shopping/domain/errors/list-not-found';
import { NoPermission } from 'shared/errors/no-permission';
import { IGetResumeByIdDTO, IGetResumeByIdResponse } from './get-resume-list-by-id-dto';
import { IShoppingList } from 'modules/shopping/domain/repositories/shopping-list-repository';
import { IShoppingListStats } from '../../domain/repositories/shopping-list-stats-repository';

class GetResumeByIdUseCase {
  constructor(
    private shoppingListRepository: IShoppingList,
    private shoppingListStatsRepository: IShoppingListStats,
  ) {}

  async execute(data: IGetResumeByIdDTO): Promise<IGetResumeByIdResponse> {
    if (data.userId == null) throw new InvalidUserIdError({ reason: 'missing' });

    const listExist = await this.shoppingListRepository.getListById(data.listId);

    if (listExist === null) throw new ListNotFound();

    if (listExist.userId !== data.userId) {
      throw new NoPermission();
    }

    const [doneItemsCount, pendingItemsCount, sumItemsCount] = await Promise.all([
      this.shoppingListStatsRepository.getDoneItemsById(data.listId),
      this.shoppingListStatsRepository.getPendingItemsById(data.listId),
      this.shoppingListStatsRepository.getSumAmountItemsById(data.listId),
    ]);

    return {
      shoppingListId: data.listId,
      doneItemsCount,
      pendingItemsCount,
      sumItemsCount,
    };
  }
}

export { GetResumeByIdUseCase };
