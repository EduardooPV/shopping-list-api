import { UserAlreadyExistsError } from '../../domain/errors/user-already-exists-error';
import { AppError } from 'shared/errors/app-error';

describe('UserAlreadyExistsError', () => {
  it('should extend AppError', () => {
    const error = new UserAlreadyExistsError();

    expect(error).toBeInstanceOf(AppError);
    expect(error).toBeInstanceOf(UserAlreadyExistsError);
  });

  it('should have correct code and message', () => {
    const error = new UserAlreadyExistsError();

    expect(error.code).toBe('USER_ALREADY_EXISTS');
    expect(error.message).toBe('User already exists.');
  });

  it('should include email details when provided', () => {
    const error = new UserAlreadyExistsError('john@example.com');

    expect(error.details).toEqual({ email: 'john@example.com' });
  });

  it('should not include details when email is not provided', () => {
    const error = new UserAlreadyExistsError();

    expect(error.details).toBeUndefined();
  });
});
