import { AppError } from 'shared/errors/app-error';

class InvalidItemName extends AppError {
  constructor(details?: { reason: 'missing' | 'format' }) {
    super('INVALID_ITEM_NAME', 'Invalid name.', details);
  }
}

export { InvalidItemName };
