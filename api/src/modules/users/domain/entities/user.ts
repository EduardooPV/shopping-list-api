import crypto from 'crypto';
import { UserName } from '../object-values/user-name';

class User {
  public readonly id: string;
  public readonly name: string;
  public readonly email: string;
  public readonly password: string;

  private constructor(id: string, name: string, email: string, password: string) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    Object.freeze(this);
  }

  static create(name: string, email: string, password: string): User {
    const userName = new UserName(name);
    return new User(crypto.randomUUID(), userName.getValue(), email, password);
  }

  static reconstitute(raw: { id: string; name: string; email: string; password: string }): User {
    return new User(raw.id, raw.name, raw.email, raw.password);
  }
}

export { User };
