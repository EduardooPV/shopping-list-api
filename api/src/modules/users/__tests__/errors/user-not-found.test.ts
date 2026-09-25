import { UserNotFound } from '../../domain/errors/user-not-found';
import { AppError } from 'shared/errors/app-error';

describe('UserNotFound', () => {
  it('should extend AppError', () => {
    const error = new UserNotFound();

    expect(error).toBeInstanceOf(AppError);
    expect(error).toBeInstanceOf(UserNotFound);
  });

  it('should have correct code and message', () => {
    const error = new UserNotFound();

    expect(error.code).toBe('USER_NOT_FOUND');
    expect(error.message).toBe('User not found.');
  });

  it('should not have details by default', () => {
    const error = new UserNotFound();

    expect(error.details).toBeUndefined();
  });
});
