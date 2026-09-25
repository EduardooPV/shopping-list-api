// @ts-nocheck
import { InvalidShoppingListId } from 'modules/item/domain/errors/invalid-shopping-list-id';
import { AppError } from 'shared/errors/app-error';

describe('InvalidShoppingListId', () => {
  it('should create an instance of AppError with correct properties', () => {
    const error = new InvalidShoppingListId();

    expect(error).toBeInstanceOf(AppError);
    expect(error.code).toBe('INVALID_SHOPPING_LIST_ID');
    expect(error.message).toBe('Invalid shopping list id.');
  });

  it('should have a proper name and stack trace', () => {
    const error = new InvalidShoppingListId();

    expect(error.name).toBe('InvalidShoppingListId');
    expect(error.stack).toContain('InvalidShoppingListId');
  });
});
