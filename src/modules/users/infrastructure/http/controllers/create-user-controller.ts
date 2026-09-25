import { IncomingMessage, ServerResponse } from 'http';
import { CreateUserUseCase } from 'modules/users/application/create-user/create-user-use-case';
import { BodyParser } from 'core/http/utils/parse-body';
import { ReplyResponder } from 'core/http/utils/reply';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(6),
});

class CreateUserController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  async handle(request: IncomingMessage, response: ServerResponse): Promise<void> {
    const rawBody = await BodyParser.parse(request);

    const { name, email, password } = schema.parse(rawBody);

    await this.createUserUseCase.execute({
      name,
      email,
      password,
    });

    new ReplyResponder(response).created({ name, email }, '/users/:id');
  }
}

export { CreateUserController };
