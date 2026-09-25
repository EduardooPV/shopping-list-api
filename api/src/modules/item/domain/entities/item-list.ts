import crypto from 'crypto';
import { ItemStatus } from '../value-objects/item-status';
import { InvalidItemName } from '../errors/invalid-item-name';

class ItemList {
  public readonly id: string;
  public readonly name: string;
  public readonly status: ItemStatus;
  public readonly quantity: number;
  public readonly amount: number;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  private constructor(
    id: string,
    name: string,
    status: ItemStatus,
    quantity: number,
    amount: number,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.name = name;
    this.status = status;
    this.quantity = quantity;
    this.amount = amount;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static create(name: string, status: ItemStatus, quantity: number, amount: number): ItemList {
    if (!name || name.trim().length === 0) throw new InvalidItemName({ reason: 'missing' });
    return new ItemList(
      crypto.randomUUID(),
      name.trim(),
      status,
      quantity,
      amount,
      new Date(),
      new Date(),
    );
  }

  static reconstitute(raw: {
    id: string;
    name: string;
    status: string;
    quantity: number;
    amount: number;
    createdAt: Date;
    updatedAt: Date;
  }): ItemList {
    return new ItemList(
      raw.id,
      raw.name,
      raw.status as ItemStatus,
      raw.quantity,
      raw.amount,
      raw.createdAt,
      raw.updatedAt,
    );
  }
}

export { ItemList };
