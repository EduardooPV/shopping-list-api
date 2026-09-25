import { IncomingMessage, ServerResponse } from 'http';
import { CreateItemUseCase } from 'modules/item/application/create-item/create-item-use-case';
import { BodyParser } from 'core/http/utils/parse-body';
import { ReplyResponder } from 'core/http/utils/reply';
import { CreateItemViewModel } from 'modules/item/application/create-item/create-list-view-model';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1),
  quantity: z.number().int().positive(),
  amount: z.number().nonnegative(),
  status: z.enum(['pending', 'done']).default('pending'),
});

class CreateItemController {
  constructor(private createItemUseCase: CreateItemUseCase) {}

  async handle(
    request: IncomingMessage & { userId?: string; params?: { shoppingListId?: string } },
    response: ServerResponse,
  ): Promise<void> {
    const rawBody = await BodyParser.parse(request);
    const shoppingListId = request.params?.shoppingListId;
    const userId = request.userId;

    const { name, quantity, amount, status } = schema.parse(rawBody);

    const item = await this.createItemUseCase.execute({
      name,
      shoppingListId,
      userId,
      status,
      quantity,
      amount,
    });
    const itemHTTP = CreateItemViewModel.toHTTP(item);

    new ReplyResponder(response).created(itemHTTP);
  }
}

export { CreateItemController };
