// @ts-nocheck
import crypto from 'crypto';
import { ItemList } from 'modules/item/domain/entities/item-list';
import { ItemStatus } from 'modules/item/domain/value-objects/item-status';
import { InvalidItemName } from 'modules/item/domain/errors/invalid-item-name';

describe('ItemList Entity', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create an ItemList with valid properties', () => {
    const mockUUID = 'uuid-123';
    jest.spyOn(crypto, 'randomUUID').mockReturnValue(mockUUID);

    const item = ItemList.create('Bananas', ItemStatus.Pending, 3, 12.5);

    expect(item.id).toBe(mockUUID);
    expect(item.name).toBe('Bananas');
    expect(item.status).toBe(ItemStatus.Pending);
    expect(item.quantity).toBe(3);
    expect(item.amount).toBe(12.5);
    expect(item.createdAt).toBeInstanceOf(Date);
    expect(item.updatedAt).toBeInstanceOf(Date);
  });

  it('should throw InvalidItemName when name is empty', () => {
    expect(() => ItemList.create('', ItemStatus.Pending, 1, 1.0)).toThrow(InvalidItemName);
  });

  it('should throw InvalidItemName when name is whitespace only', () => {
    expect(() => ItemList.create('   ', ItemStatus.Pending, 1, 1.0)).toThrow(InvalidItemName);
  });

  it('should trim the name', () => {
    const item = ItemList.create('  Apples  ', ItemStatus.Done, 2, 8.0);
    expect(item.name).toBe('Apples');
  });

  it('should generate a unique id for each new ItemList', () => {
    const uuidSpy = jest.spyOn(crypto, 'randomUUID');
    ItemList.create('Apples', ItemStatus.Done, 2, 8.0);
    ItemList.create('Oranges', ItemStatus.Pending, 5, 15.0);
    expect(uuidSpy).toHaveBeenCalledTimes(2);
  });

  it('should reconstitute an ItemList with an existing id', () => {
    const now = new Date();
    const item = ItemList.reconstitute({
      id: 'existing-id',
      name: 'Milk',
      status: 'done',
      quantity: 1,
      amount: 5.0,
      createdAt: now,
      updatedAt: now,
    });

    expect(item.id).toBe('existing-id');
    expect(item.status).toBe(ItemStatus.Done);
  });
});
