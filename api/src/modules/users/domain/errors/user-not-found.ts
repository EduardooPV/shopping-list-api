import { AppError } from 'shared/errors/app-error';

class UserNotFound extends AppError {
  constructor() {
    super('USER_NOT_FOUND', 'User not found.');
  }
}

export { UserNotFound };
