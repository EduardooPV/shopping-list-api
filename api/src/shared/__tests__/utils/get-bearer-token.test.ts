import { describe, it, expect } from '@jest/globals';
import { AuthHelper } from 'shared/utils/get-bearer-token';

describe('AuthHelper', () => {
  it('should return null if authorization is undefined', () => {
    expect(AuthHelper.getBearerToken(undefined)).toBeNull();
  });

  it('should return null if authorization is null', () => {
    // @ts-expect-error
    expect(AuthHelper.getBearerToken(null)).toBeNull();
  });

  it('should return null if scheme is not Bearer', () => {
    expect(AuthHelper.getBearerToken('Basic abc123')).toBeNull();
    expect(AuthHelper.getBearerToken('Token xyz')).toBeNull();
    expect(AuthHelper.getBearerToken('')).toBeNull();
  });

  it('should return null if Bearer has no token', () => {
    expect(AuthHelper.getBearerToken('Bearer')).toBeNull();
    expect(AuthHelper.getBearerToken('Bearer ')).toBeNull();
  });

  it('should return the token when scheme is valid Bearer', () => {
    expect(AuthHelper.getBearerToken('Bearer abc123')).toBe('abc123');
  });

  it('should accept case-insensitive Bearer scheme', () => {
    expect(AuthHelper.getBearerToken('bearer abc123')).toBe('abc123');
    expect(AuthHelper.getBearerToken('BEARER xyz789')).toBe('xyz789');
  });

  it('should ignore extra spaces between scheme and token', () => {
    expect(AuthHelper.getBearerToken('Bearer     token123')).toBe('token123');
  });
});
