import { AppError } from 'shared/errors/app-error';

describe('AppError', () => {
  it('should create an instance of AppError with correct properties', () => {
    const error = new AppError('USER_NOT_FOUND', 'User not found');

    expect(error).toBeInstanceOf(AppError);
    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('AppError');
    expect(error.message).toBe('User not found');
    expect(error.code).toBe('USER_NOT_FOUND');
    expect(error.isOperational).toBe(true);
    expect(error.details).toBeUndefined();
  });

  it('should include details when provided', () => {
    const details = { userId: 42 };
    const error = new AppError('USER_NOT_FOUND', 'User not found', details);

    expect(error.details).toEqual(details);
  });

  it('should preserve prototype chain (instanceof works)', () => {
    const error = new AppError('GENERIC_ERROR', 'Something went wrong');

    expect(error instanceof AppError).toBe(true);
    expect(error instanceof Error).toBe(true);
  });

  it('should have enumerable properties correctly set', () => {
    const error = new AppError('GENERIC', 'Generic error');
    const keys = Object.keys(error);

    expect(keys).toContain('code');
    expect(keys).toContain('details');
    expect(keys).toContain('isOperational');
  });
});
