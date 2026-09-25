import { IncomingMessage, ServerResponse } from 'http';
import { BodyParser } from 'core/http/utils/parse-body';
import { ReplyResponder } from 'core/http/utils/reply';
import { UpdateItemByIdUseCase } from 'modules/item/application/update-item-by-id/update-item-by-id-use-case';
import { UpdateItemByIdViewModel } from 'modules/item/application/update-item-by-id/update-item-by-id-view-model';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1).optional(),
  quantity: z.number().int().positive().optional(),
  amount: z.number().nonnegative().optional(),
  status: z.enum(['pending', 'done']).optional(),
});

class UpdateItemByIdController {
  constructor(private updateItemByIdUseCase: UpdateItemByIdUseCase) {}

  async handle(
    request: IncomingMessage & {
      userId?: string;
      params?: { shoppingListId?: string; itemId?: string };
    },
    response: ServerResponse,
  ): Promise<void> {
    const rawBody = await BodyParser.parse(request);
    const userId = request.userId;
    const itemId = request.params?.itemId;
    const shoppingListId = request.params?.shoppingListId;

    const body = schema.parse(rawBody);

    const item = await this.updateItemByIdUseCase.execute({
      ...body,
      shoppingListId,
      userId,
      itemId,
    });
    const itemHTTP = UpdateItemByIdViewModel.toHTTP(item);

    new ReplyResponder(response).ok(itemHTTP);
  }
}

export { UpdateItemByIdController };
