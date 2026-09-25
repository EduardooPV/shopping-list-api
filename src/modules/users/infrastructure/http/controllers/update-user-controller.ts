import { IncomingMessage, ServerResponse } from 'http';
import { UpdateUserUseCase } from 'modules/users/application/update-user/update-user-use-case';
import { BodyParser } from 'core/http/utils/parse-body';
import { ReplyResponder } from 'core/http/utils/reply';
import { UpdateUserViewModel } from 'modules/users/application/update-user/update-user-view-model';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2).max(50),
  password: z.string().min(6),
});

class UpdateUserController {
  constructor(private updateUserUseCase: UpdateUserUseCase) {}

  async handle(
    request: IncomingMessage & { userId?: string },
    response: ServerResponse,
  ): Promise<void> {
    const rawBody = await BodyParser.parse(request);
    const id = request.userId;

    const body = schema.parse(rawBody);

    const user = await this.updateUserUseCase.execute({ id, ...body });
    const userHTTP = UpdateUserViewModel.toHTTP(user);

    new ReplyResponder(response).ok(userHTTP);
  }
}

export { UpdateUserController };
