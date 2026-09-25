import { IncomingMessage, ServerResponse } from 'http';
import { ReplyResponder } from 'core/http/utils/reply';
import { DeleteItemByIdUseCase } from 'modules/item/application/delete-item-by-id/delete-item-by-id-use-case';

class DeleteItemByIdController {
  constructor(private deleteItemByIdUseCase: DeleteItemByIdUseCase) {}

  async handle(
    request: IncomingMessage & {
      userId?: string;
      params?: { shoppingListId?: string; itemId?: string };
    },
    response: ServerResponse,
  ): Promise<void> {
    const shoppingListId = request.params?.shoppingListId;
    const itemId = request.params?.itemId;
    const userId = request.userId;

    await this.deleteItemByIdUseCase.execute({
      itemId,
      shoppingListId,
      userId,
    });

    new ReplyResponder(response).noContent();
  }
}

export { DeleteItemByIdController };
