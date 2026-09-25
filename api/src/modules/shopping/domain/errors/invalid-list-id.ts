import { AppError } from 'shared/errors/app-error';

class InvalidListId extends AppError {
  constructor() {
    super('INVALID_LIST_ID', 'Invalid list id.');
  }
}

export { InvalidListId };
