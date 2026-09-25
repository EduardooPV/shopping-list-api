import { IncomingMessage, ServerResponse } from 'http';
import { GetUserUseCase } from 'modules/users/application/get-user/get-user-use-case';
import { ReplyResponder } from 'core/http/utils/reply';
import { GetUserViewModel } from 'modules/users/application/get-user/get-user-view-model';

class GetUserController {
  constructor(private getUserUseCase: GetUserUseCase) {}

  async handle(
    request: IncomingMessage & { userId?: string },
    response: ServerResponse,
  ): Promise<void> {
    const id = request.userId;

    const user = await this.getUserUseCase.execute({ id });
    const userHTTP = GetUserViewModel.toHTTP(user);

    new ReplyResponder(response).ok(userHTTP);
  }
}

export { GetUserController };
