import { AppError } from 'shared/errors/app-error';

class InvalidUserNameError extends AppError {
  constructor(details?: { reason: 'missing' | 'too_short' | 'too_long' }) {
    super('INVALID_USER_NAME', 'Invalid user name.', details);
  }
}

export { InvalidUserNameError };
