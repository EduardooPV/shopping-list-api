// @ts-nocheck

import { IncomingMessage, ServerResponse } from 'http';
import { CreateListUseCase } from 'modules/shopping/application/create-list/create-list-use-case';
import { BodyParser } from 'core/http/utils/parse-body';
import { CreateListViewModel } from 'modules/shopping/application/create-list/create-list-view-model';
import { ReplyResponder } from 'core/http/utils/reply';
import { CreateListController } from 'modules/shopping/infrastructure/http/controllers/create-list-controller';

describe('CreateListController', () => {
  let createListUseCase: { execute: jest.Mock };
  let controller: CreateListController;
  let mockRequest: Partial<IncomingMessage> & { userId?: string };
  let mockResponse: Partial<ServerResponse>;

  beforeEach(() => {
    createListUseCase = { execute: jest.fn() };
    controller = new CreateListController(createListUseCase as unknown as CreateListUseCase);
    mockRequest = { userId: 'user-123' };
    mockResponse = {
      setHeader: jest.fn(),
      end: jest.fn(),
    };

    jest.spyOn(BodyParser, 'parse').mockResolvedValue({
      name: 'Groceries',
    });

    jest.spyOn(CreateListViewModel, 'toHTTP').mockReturnValue({
      id: 'list-1',
      name: 'Groceries',
      userId: 'user-123',
    });

    jest.spyOn(ReplyResponder.prototype, 'created').mockImplementation(jest.fn());
  });

  it('should create a list successfully and return 201', async () => {
    createListUseCase.execute.mockResolvedValue({
      id: 'list-1',
      name: 'Groceries',
      userId: 'user-123',
    });

    await controller.handle(mockRequest as IncomingMessage, mockResponse as ServerResponse);

    expect(BodyParser.parse).toHaveBeenCalledWith(mockRequest);
    expect(createListUseCase.execute).toHaveBeenCalledWith({
      name: 'Groceries',
      userId: 'user-123',
    });
    expect(CreateListViewModel.toHTTP).toHaveBeenCalledWith({
      id: 'list-1',
      name: 'Groceries',
      userId: 'user-123',
    });
    expect(ReplyResponder.prototype.created).toHaveBeenCalledWith({
      id: 'list-1',
      name: 'Groceries',
      userId: 'user-123',
    });
  });

  it('should propagate an error if use case throws', async () => {
    createListUseCase.execute.mockRejectedValue(new Error('Failed'));
    await expect(
      controller.handle(mockRequest as IncomingMessage, mockResponse as ServerResponse),
    ).rejects.toThrow('Failed');
  });
});
