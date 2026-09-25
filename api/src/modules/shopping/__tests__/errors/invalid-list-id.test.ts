// @ts-nocheck
import { InvalidListId } from 'modules/shopping/domain/errors/invalid-list-id';
import { AppError } from 'shared/errors/app-error';

describe('InvalidListId', () => {
  it('should create an instance of AppError with correct properties', () => {
    const error = new InvalidListId();

    expect(error).toBeInstanceOf(AppError);
    expect(error.code).toBe('INVALID_LIST_ID');
    expect(error.message).toBe('Invalid list id.');
  });

  it('should have a proper name and stack trace', () => {
    const error = new InvalidListId();

    expect(error.name).toBe('InvalidListId');
    expect(error.stack).toContain('InvalidListId');
  });
});
