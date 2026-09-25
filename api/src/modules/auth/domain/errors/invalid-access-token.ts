import { AppError } from 'shared/errors/app-error';

class InvalidAccessToken extends AppError {
  constructor(details?: { reason?: 'malformed' | 'signature' | 'expired' }) {
    super('INVALID_ACCESS_TOKEN', 'Invalid access token.', details);
  }
}

export { InvalidAccessToken };
