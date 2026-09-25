import { AppError } from 'shared/errors/app-error';

class InvalidCredentials extends AppError {
  constructor() {
    super('INVALID_CREDENTIALS', 'Invalid email or password.');
  }
}

export { InvalidCredentials };
