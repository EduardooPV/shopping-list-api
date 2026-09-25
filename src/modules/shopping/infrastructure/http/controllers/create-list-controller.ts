import { IncomingMessage, ServerResponse } from 'http';
import { CreateListUseCase } from 'modules/shopping/application/create-list/create-list-use-case';
import { BodyParser } from 'core/http/utils/parse-body';
import { CreateListViewModel } from 'modules/shopping/application/create-list/create-list-view-model';
import { ReplyResponder } from 'core/http/utils/reply';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1).max(100),
});

class CreateListController {
  constructor(private createListUseCase: CreateListUseCase) {}

  async handle(
    request: IncomingMessage & { userId?: string },
    response: ServerResponse,
  ): Promise<void> {
    const rawBody = await BodyParser.parse(request);
    const userId = request.userId;

    const { name } = schema.parse(rawBody);

    const shoppingList = await this.createListUseCase.execute({
      name,
      userId,
    });
    const shoppingListHTTP = CreateListViewModel.toHTTP(shoppingList);

    new ReplyResponder(response).created(shoppingListHTTP);
  }
}

export { CreateListController };
