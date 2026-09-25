import { AppError } from 'shared/errors/app-error';

class ItemNotFound extends AppError {
  constructor() {
    super('ITEM_NOT_FOUND', 'Item not found.');
  }
}

export { ItemNotFound };
