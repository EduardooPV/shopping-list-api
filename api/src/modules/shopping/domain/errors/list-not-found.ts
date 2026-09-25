import { AppError } from 'shared/errors/app-error';

class ListNotFound extends AppError {
  constructor() {
    super('LIST_NOT_FOUND', 'List not found.');
  }
}

export { ListNotFound };
