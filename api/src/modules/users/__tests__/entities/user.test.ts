// @ts-nocheck
import crypto from 'crypto';
import { User } from 'modules/users/domain/entities/user';

jest.mock('crypto');

describe('User Entity', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (crypto.randomUUID as jest.Mock).mockReturnValue('mocked-uuid');
  });

  it('should create a user with all required properties', () => {
    const user = User.create('John Doe', 'john@example.com', 'hashed_password');

    expect(user.id).toBe('mocked-uuid');
    expect(user.name).toBe('John Doe');
    expect(user.email).toBe('john@example.com');
    expect(user.password).toBe('hashed_password');
  });

  it('should make the user object immutable', () => {
    const user = User.create('Anna', 'anna@example.com', 'hashed_password');

    expect(Object.isFrozen(user)).toBe(true);
  });

  it('should reconstitute a user with an existing id', () => {
    const raw = {
      id: 'existing-id',
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'hashed',
    };

    const user = User.reconstitute(raw);

    expect(user.id).toBe('existing-id');
    expect(user.name).toBe('Jane Doe');
    expect(user.email).toBe('jane@example.com');
    expect(Object.isFrozen(user)).toBe(true);
  });

  it('should not call randomUUID when reconstituting', () => {
    User.reconstitute({ id: 'some-id', name: 'Bob', email: 'b@b.com', password: 'x' });
    expect(crypto.randomUUID).not.toHaveBeenCalled();
  });
});
