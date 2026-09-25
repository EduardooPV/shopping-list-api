// @ts-nocheck
import { ListNotFound } from 'modules/shopping/domain/errors/list-not-found';
import { AppError } from 'shared/errors/app-error';

describe('ListNotFound', () => {
  it('should be an instance of AppError with correct properties', () => {
    const error = new ListNotFound();

    expect(error).toBeInstanceOf(AppError);
    expect(error.code).toBe('LIST_NOT_FOUND');
    expect(error.message).toBe('List not found.');
  });

  it('should have a proper name and stack trace', () => {
    const error = new ListNotFound();

    expect(error.name).toBe('ListNotFound');
    expect(error.stack).toContain('ListNotFound');
  });
});
