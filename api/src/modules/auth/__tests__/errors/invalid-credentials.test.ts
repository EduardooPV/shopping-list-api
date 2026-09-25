import { describe, it, expect } from '@jest/globals';
import { InvalidCredentials } from '../../domain/errors/invalid-credentials';

describe('InvalidCredentials Error', () => {
  it('should create an error with correct code and message', () => {
    const error = new InvalidCredentials();

    expect(error).toBeInstanceOf(InvalidCredentials);
    expect(error.code).toBe('INVALID_CREDENTIALS');
    expect(error.message).toBe('Invalid email or password.');
    expect(error.isOperational).toBe(true);
  });
});
