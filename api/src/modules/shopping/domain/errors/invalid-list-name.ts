import { AppError } from 'shared/errors/app-error';

class InvalidListName extends AppError {
  constructor(details?: { reason: 'missing' | 'format' }) {
    super('INVALID_LIST_NAME', 'Invalid name.', details);
  }
}

export { InvalidListName };
