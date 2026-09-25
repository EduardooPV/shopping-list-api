// @ts-nocheck

import { IncomingMessage, ServerResponse } from 'http';
import { GetAllListsUseCase } from 'modules/shopping/application/get-all-lists/get-all-lists-use-case';
import { ReplyResponder } from 'core/http/utils/reply';
import { GetAllListsViewModel } from 'modules/shopping/application/get-all-lists/get-all-lists-view-model';
import { PaginationHelper } from 'shared/utils/pagination-params';
import { GetAllListsController } from 'modules/shopping/infrastructure/http/controllers/get-all-list-controller';

describe('GetAllListsController', () => {
  let getAllListsUseCase: { execute: jest.Mock };
  let controller: GetAllListsController;
  let mockRequest: Partial<IncomingMessage> & { userId?: string; url?: string };
  let mockResponse: Partial<ServerResponse>;

  beforeEach(() => {
    getAllListsUseCase = { execute: jest.fn() };
    controller = new GetAllListsController(getAllListsUseCase as unknown as GetAllListsUseCase);

    mockRequest = {
      userId: 'user-123',
      url: '/lists?page=1&perPage=5',
    };

    mockResponse = {
      setHeader: jest.fn(),
      end: jest.fn(),
    };

    jest.spyOn(PaginationHelper, 'fromRequest').mockReturnValue({ page: 1, perPage: 5 });
    jest.spyOn(ReplyResponder.prototype, 'ok').mockImplementation(jest.fn());
    jest.spyOn(GetAllListsViewModel, 'toHTTP').mockImplementation((list) => list);
  });

  it('should get all lists successfully and return 200', async () => {
    getAllListsUseCase.execute.mockResolvedValue({
      items: [
        { id: 'list-1', name: 'Groceries', userId: 'user-123' },
        { id: 'list-2', name: 'Electronics', userId: 'user-123' },
      ],
      pagination: { page: 1, perPage: 5, total: 2 },
    });

    await controller.handle(mockRequest as IncomingMessage, mockResponse as ServerResponse);

    expect(PaginationHelper.fromRequest).toHaveBeenCalledWith({ request: mockRequest });
    expect(getAllListsUseCase.execute).toHaveBeenCalledWith({
      userId: 'user-123',
      page: 1,
      perPage: 5,
    });
    expect(GetAllListsViewModel.toHTTP).toHaveBeenCalledTimes(2);
    expect(ReplyResponder.prototype.ok).toHaveBeenCalledWith({
      items: [
        { id: 'list-1', name: 'Groceries', userId: 'user-123' },
        { id: 'list-2', name: 'Electronics', userId: 'user-123' },
      ],
      pagination: { page: 1, perPage: 5, total: 2 },
    });
  });

  it('should propagate an error if use case throws', async () => {
    getAllListsUseCase.execute.mockRejectedValue(new Error('Failed'));
    await expect(
      controller.handle(mockRequest as IncomingMessage, mockResponse as ServerResponse),
    ).rejects.toThrow('Failed');
  });
});
