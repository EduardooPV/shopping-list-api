// @ts-nocheck
import { IncomingMessage, ServerResponse } from 'http';
import { GetListByIdUseCase } from 'modules/shopping/application/get-list-by-id/get-list-by-id-use-case';
import { GetListByIdViewModel } from 'modules/shopping/application/get-list-by-id/get-list-by-id-view-model';
import { ReplyResponder } from 'core/http/utils/reply';
import { GetListByIdController } from 'modules/shopping/infrastructure/http/controllers/get-list-by-id-controller';

describe('GetListByIdController', () => {
  let getListByIdUseCase: { execute: jest.Mock };
  let controller: GetListByIdController;
  let mockRequest: Partial<IncomingMessage> & { userId?: string; params?: Record<string, string> };
  let mockResponse: Partial<ServerResponse>;

  beforeEach(() => {
    getListByIdUseCase = { execute: jest.fn() };
    controller = new GetListByIdController(getListByIdUseCase as unknown as GetListByIdUseCase);

    mockRequest = {
      userId: 'user-123',
      params: { id: 'list-123' },
    };

    mockResponse = {
      setHeader: jest.fn(),
      end: jest.fn(),
    };

    jest.spyOn(ReplyResponder.prototype, 'ok').mockImplementation(jest.fn());
    jest.spyOn(GetListByIdViewModel, 'toHTTP').mockImplementation((list) => list);
  });

  it('should return 200 with the list', async () => {
    const mockList = { id: 'list-123', name: 'Groceries', userId: 'user-123' };
    getListByIdUseCase.execute.mockResolvedValue(mockList);

    await controller.handle(mockRequest as IncomingMessage, mockResponse as ServerResponse);

    expect(getListByIdUseCase.execute).toHaveBeenCalledWith({ id: 'list-123' });
    expect(GetListByIdViewModel.toHTTP).toHaveBeenCalledWith(mockList);
    expect(ReplyResponder.prototype.ok).toHaveBeenCalledWith(mockList);
  });

  it('should propagate an error if use case throws', async () => {
    getListByIdUseCase.execute.mockRejectedValue(new Error('Not found'));

    await expect(
      controller.handle(mockRequest as IncomingMessage, mockResponse as ServerResponse),
    ).rejects.toThrow('Not found');
  });
});
