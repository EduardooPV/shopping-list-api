import { AppError } from 'shared/errors/app-error';

class InvalidShoppingListId extends AppError {
  constructor() {
    super('INVALID_SHOPPING_LIST_ID', 'Invalid shopping list id.');
  }
}

export { InvalidShoppingListId };
