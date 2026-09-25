import { AppError } from 'shared/errors/app-error';

class InvalidRefreshToken extends AppError {
  constructor() {
    super('INVALID_REFRESH_TOKEN', 'Invalid refresh token.');
  }
}

export { InvalidRefreshToken };
