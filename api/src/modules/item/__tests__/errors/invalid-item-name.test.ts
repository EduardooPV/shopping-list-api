// @ts-nocheck
import { InvalidItemName } from 'modules/item/domain/errors/invalid-item-name';
import { AppError } from 'shared/errors/app-error';

describe('InvalidItemName', () => {
  it('should create an instance of AppError with correct base properties', () => {
    const error = new InvalidItemName();

    expect(error).toBeInstanceOf(AppError);
    expect(error.code).toBe('INVALID_ITEM_NAME');
    expect(error.message).toBe('Invalid name.');
    expect(error.details).toBeUndefined();
  });

  it('should accept details with reason "missing"', () => {
    const error = new InvalidItemName({ reason: 'missing' });

    expect(error.details).toEqual({ reason: 'missing' });
    expect(error.code).toBe('INVALID_ITEM_NAME');
    expect(error.message).toBe('Invalid name.');
  });

  it('should accept details with reason "format"', () => {
    const error = new InvalidItemName({ reason: 'format' });

    expect(error.details).toEqual({ reason: 'format' });
    expect(error.code).toBe('INVALID_ITEM_NAME');
    expect(error.message).toBe('Invalid name.');
  });

  it('should have a proper name and stack trace', () => {
    const error = new InvalidItemName();

    expect(error.name).toBe('InvalidItemName');
    expect(error.stack).toContain('InvalidItemName');
  });
});
