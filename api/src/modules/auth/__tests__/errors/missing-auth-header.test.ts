import { describe, it, expect } from '@jest/globals';
import { MissingAuthHeader } from '../../domain/errors/missing-auth-header';

describe('MissingAuthHeader Error', () => {
  it('should create an error with correct code and message', () => {
    const error = new MissingAuthHeader();

    expect(error).toBeInstanceOf(MissingAuthHeader);
    expect(error.code).toBe('MISSING_AUTH_HEADER');
    expect(error.message).toBe('Authorization header is required.');
    expect(error.isOperational).toBe(true);
  });
});
