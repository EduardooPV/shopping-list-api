// @ts-nocheck
import { InvalidListName } from 'modules/shopping/domain/errors/invalid-list-name';
import { AppError } from 'shared/errors/app-error';

describe('InvalidListName', () => {
  it('should create an instance of AppError with correct properties', () => {
    const error = new InvalidListName();

    expect(error).toBeInstanceOf(AppError);
    expect(error.code).toBe('INVALID_LIST_NAME');
    expect(error.message).toBe('Invalid name.');
    expect(error.details).toBeUndefined();
  });

  it('should include details when provided', () => {
    const error = new InvalidListName({ reason: 'missing' });

    expect(error.details).toEqual({ reason: 'missing' });
  });

  it('should have a proper name and stack trace', () => {
    const error = new InvalidListName({ reason: 'format' });

    expect(error.name).toBe('InvalidListName');
    expect(error.stack).toContain('InvalidListName');
  });
});
