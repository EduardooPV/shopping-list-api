// @ts-nocheck
import { ItemNotFound } from 'modules/item/domain/errors/item-not-found';
import { AppError } from 'shared/errors/app-error';

describe('ItemNotFound', () => {
  it('should create an instance of AppError with correct properties', () => {
    const error = new ItemNotFound();

    expect(error).toBeInstanceOf(AppError);
    expect(error.code).toBe('ITEM_NOT_FOUND');
    expect(error.message).toBe('Item not found.');
  });

  it('should have a proper name and stack trace', () => {
    const error = new ItemNotFound();

    expect(error.name).toBe('ItemNotFound');
    expect(error.stack).toContain('ItemNotFound');
  });
});
