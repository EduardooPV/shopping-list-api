import { IncomingMessage, ServerResponse } from 'http';
import { DeleteUserUseCase } from 'modules/users/application/delete-user/delete-user-use-case';
import { ReplyResponder } from 'core/http/utils/reply';

class DeleteUserController {
  constructor(private deleteUserByIdUseCase: DeleteUserUseCase) {}

  async handle(
    request: IncomingMessage & { userId?: string },
    response: ServerResponse,
  ): Promise<void> {
    const id = request.userId;

    await this.deleteUserByIdUseCase.execute({ id });

    new ReplyResponder(response).noContent();
  }
}

export { DeleteUserController };
