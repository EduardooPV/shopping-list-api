import { AppError } from 'shared/errors/app-error';

class InvalidItemId extends AppError {
  constructor() {
    super('INVALID_ITEM_ID', 'Invalid item id.');
  }
}

export { InvalidItemId };
