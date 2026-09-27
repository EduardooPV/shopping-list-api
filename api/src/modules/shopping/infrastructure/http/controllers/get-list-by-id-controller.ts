import { IncomingMessage, ServerResponse } from 'http';
import { GetListByIdUseCase } from 'modules/shopping/application/get-list-by-id/get-list-by-id-use-case';
import { GetListByIdViewModel } from 'modules/shopping/application/get-list-by-id/get-list-by-id-view-model';
import { ReplyResponder } from 'core/http/utils/reply';

class GetListByIdController {
  constructor(private getListByIdUseCase: GetListByIdUseCase) {}

  async handle(
    request: IncomingMessage & { userId?: string; params?: Record<string, string> },
    response: ServerResponse,
  ): Promise<void> {
    const id = request.params?.id;

    const list = await this.getListByIdUseCase.execute({ id });
    const listHTTP = GetListByIdViewModel.toHTTP(list);

    new ReplyResponder(response).ok(listHTTP);
  }
}

export { GetListByIdController };
