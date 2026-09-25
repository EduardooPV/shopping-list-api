import crypto from 'crypto';
import { InvalidListName } from '../errors/invalid-list-name';

class ShoppingList {
  public readonly id: string;
  public readonly userId: string;
  public readonly name: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  private constructor(id: string, userId: string, name: string, createdAt: Date, updatedAt: Date) {
    this.id = id;
    this.userId = userId;
    this.name = name;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static create(userId: string, name: string): ShoppingList {
    if (!name || name.trim().length === 0) throw new InvalidListName({ reason: 'missing' });
    return new ShoppingList(crypto.randomUUID(), userId, name.trim(), new Date(), new Date());
  }

  static reconstitute(raw: {
    id: string;
    userId: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  }): ShoppingList {
    return new ShoppingList(raw.id, raw.userId, raw.name, raw.createdAt, raw.updatedAt);
  }
}

export { ShoppingList };
