// @ts-nocheck
import { InvalidItemId } from 'modules/item/domain/errors/invalid-item-id';
import { AppError } from 'shared/errors/app-error';

describe('InvalidItemId', () => {
  it('should create an instance of AppError with correct properties', () => {
    const error = new InvalidItemId();

    expect(error).toBeInstanceOf(AppError);
    expect(error.code).toBe('INVALID_ITEM_ID');
    expect(error.message).toBe('Invalid item id.');
  });

  it('should have a proper name and stack trace', () => {
    const error = new InvalidItemId();

    expect(error.name).toBe('InvalidItemId');
    expect(error.stack).toContain('InvalidItemId');
  });
});
