import { IncomingMessage, ServerResponse } from 'http';
import { ReplyResponder } from 'core/http/utils/reply';
import { GetAllItemsByShoppingIdUseCase } from 'modules/item/application/get-all-items-by-shopping-id/get-all-items-by-shopping-id-use-case';
import { GetAllItemsByShoppingIdViewModel } from 'modules/item/application/get-all-items-by-shopping-id/get-all-items-by-shopping-id-view-model';

class GetAllItemsByShoppingIdController {
  constructor(private getAllItemsByShoppingIdUseCase: GetAllItemsByShoppingIdUseCase) {}

  async handle(
    request: IncomingMessage & { userId?: string; params?: { shoppingListId?: string } },
    response: ServerResponse,
  ): Promise<void> {
    const shoppingListId = request.params?.shoppingListId;
    const userId = request.userId;

    const items = await this.getAllItemsByShoppingIdUseCase.execute({
      shoppingListId,
      userId,
    });
    const itemsHTTP = items.map(GetAllItemsByShoppingIdViewModel.toHTTP);

    new ReplyResponder(response).created(itemsHTTP);
  }
}

export { GetAllItemsByShoppingIdController };
