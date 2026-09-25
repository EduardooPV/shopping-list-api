// @ts-nocheck

import { IncomingMessage, ServerResponse } from 'http';
import { UpdateListByIdUseCase } from 'modules/shopping/application/update-list-by-id/update-list-by-id-use-case';
import { BodyParser } from 'core/http/utils/parse-body';
import { ReplyResponder } from 'core/http/utils/reply';
import { UpdateListByIdViewModel } from 'modules/shopping/application/update-list-by-id/update-list-by-id-view-model';
import { UpdateListByIdController } from 'modules/shopping/infrastructure/http/controllers/update-list-by-id-controller';

describe('UpdateListByIdController', () => {
  let updateListByIdUseCase: { execute: jest.Mock };
  let controller: UpdateListByIdController;
  let mockRequest: Partial<IncomingMessage> & { userId?: string; params?: { id?: string } };
  let mockResponse: Partial<ServerResponse>;

  beforeEach(() => {
    updateListByIdUseCase = { execute: jest.fn() };
    controller = new UpdateListByIdController(
      updateListByIdUseCase as unknown as UpdateListByIdUseCase,
    );

    mockRequest = {
      userId: 'user-123',
      params: { id: 'list-123' },
    };

    mockResponse = {
      setHeader: jest.fn(),
      end: jest.fn(),
    };

    jest.spyOn(BodyParser, 'parse').mockResolvedValue({ name: 'Updated list' });
    jest.spyOn(ReplyResponder.prototype, 'ok').mockImplementation(jest.fn());
    jest.spyOn(UpdateListByIdViewModel, 'toHTTP').mockImplementation((list) => list);
  });

  it('should update a list successfully and return 200', async () => {
    updateListByIdUseCase.execute.mockResolvedValue({
      id: 'list-123',
      userId: 'user-123',
      name: 'Updated list',
    });

    await controller.handle(mockRequest as IncomingMessage, mockResponse as ServerResponse);

    expect(BodyParser.parse).toHaveBeenCalledWith(mockRequest);
    expect(updateListByIdUseCase.execute).toHaveBeenCalledWith({
      userId: 'user-123',
      listId: 'list-123',
      name: 'Updated list',
    });
    expect(UpdateListByIdViewModel.toHTTP).toHaveBeenCalledWith({
      id: 'list-123',
      userId: 'user-123',
      name: 'Updated list',
    });
    expect(ReplyResponder.prototype.ok).toHaveBeenCalledWith({
      id: 'list-123',
      userId: 'user-123',
      name: 'Updated list',
    });
  });

  it('should propagate an error if use case throws', async () => {
    updateListByIdUseCase.execute.mockRejectedValue(new Error('Failed'));
    await expect(
      controller.handle(mockRequest as IncomingMessage, mockResponse as ServerResponse),
    ).rejects.toThrow('Failed');
  });
});
