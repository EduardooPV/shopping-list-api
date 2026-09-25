import { InvalidUserNameError } from '../errors/invalid-user-name-error';

class UserName {
  private readonly value: string;

  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new InvalidUserNameError({ reason: 'missing' });
    }

    if (value.trim().length < 2) {
      throw new InvalidUserNameError({ reason: 'too_short' });
    }

    if (value.trim().length > 50) {
      throw new InvalidUserNameError({ reason: 'too_long' });
    }

    this.value = value.trim();
    Object.freeze(this);
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: UserName): boolean {
    return this.value === other.value;
  }
}

export { UserName };
