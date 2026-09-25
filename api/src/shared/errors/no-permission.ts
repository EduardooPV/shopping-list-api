import { AppError } from 'shared/errors/app-error';

class NoPermission extends AppError {
  constructor() {
    super('FORBIDDEN', 'You do not have permission to access this resource.');
  }
}

export { NoPermission };
