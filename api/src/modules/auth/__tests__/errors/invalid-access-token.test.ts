import { describe, it, expect } from '@jest/globals';
import { InvalidAccessToken } from '../../domain/errors/invalid-access-token';

describe('InvalidAccessToken Error', () => {
  it('should create an error with default message and code', () => {
    const error = new InvalidAccessToken();

    expect(error).toBeInstanceOf(InvalidAccessToken);
    expect(error.code).toBe('INVALID_ACCESS_TOKEN');
    expect(error.message).toBe('Invalid access token.');
    expect(error.isOperational).toBe(true);
  });

  it('should include details when provided', () => {
    const details = { reason: 'expired' as const };
    const error = new InvalidAccessToken(details);

    expect(error.details).toEqual(details);
  });
});
