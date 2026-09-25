import { IncomingMessage, ServerResponse } from 'http';
import { DeleteListByIdUseCase } from 'modules/shopping/application/delete-list-by-id/delete-list-by-id-use-case';
import { ReplyResponder } from 'core/http/utils/reply';

class DeleteListByIdController {
  constructor(private deleteListByIdUseCase: DeleteListByIdUseCase) {}

  async handle(
    request: IncomingMessage & { userId?: string; params?: { id?: string } },
    response: ServerResponse,
  ): Promise<void> {
    const userId = request.userId;
    const listId = request.params?.id;

    await this.deleteListByIdUseCase.execute({
      userId,
      id: listId,
    });

    new ReplyResponder(response).noContent();
  }
}

export { DeleteListByIdController };
