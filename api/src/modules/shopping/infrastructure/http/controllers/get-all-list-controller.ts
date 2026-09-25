import { IncomingMessage, ServerResponse } from 'http';
import { GetAllListsUseCase } from 'modules/shopping/application/get-all-lists/get-all-lists-use-case';
import { ReplyResponder } from 'core/http/utils/reply';
import { GetAllListsViewModel } from 'modules/shopping/application/get-all-lists/get-all-lists-view-model';
import { PaginationHelper } from 'shared/utils/pagination-params';

class GetAllListsController {
  constructor(private getAllListsUseCase: GetAllListsUseCase) {}

  async handle(
    request: IncomingMessage & { userId?: string },
    response: ServerResponse,
  ): Promise<void> {
    const userId = request.userId;
    const { page, perPage } = PaginationHelper.fromRequest({ request });

    const shoppingList = await this.getAllListsUseCase.execute({
      userId,
      page,
      perPage,
    });

    const shoppingListsHTTP = shoppingList.items.map(GetAllListsViewModel.toHTTP);

    return new ReplyResponder(response).ok({
      items: shoppingListsHTTP,
      pagination: shoppingList.pagination,
    });
  }
}

export { GetAllListsController };
