// @ts-nocheck
import crypto from 'crypto';
import { ShoppingList } from 'modules/shopping/domain/entities/shopping-list';
import { InvalidListName } from 'modules/shopping/domain/errors/invalid-list-name';

describe('ShoppingList Entity', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a ShoppingList with valid properties', () => {
    const mockUUID = 'uuid-123';
    jest.spyOn(crypto, 'randomUUID').mockReturnValue(mockUUID);

    const shoppingList = ShoppingList.create('user-123', 'Groceries');

    expect(shoppingList.id).toBe(mockUUID);
    expect(shoppingList.userId).toBe('user-123');
    expect(shoppingList.name).toBe('Groceries');
    expect(shoppingList.createdAt).toBeInstanceOf(Date);
    expect(shoppingList.updatedAt).toBeInstanceOf(Date);
  });

  it('should throw InvalidListName when name is empty', () => {
    expect(() => ShoppingList.create('user-123', '')).toThrow(InvalidListName);
  });

  it('should throw InvalidListName when name is whitespace only', () => {
    expect(() => ShoppingList.create('user-123', '   ')).toThrow(InvalidListName);
  });

  it('should trim the name', () => {
    const list = ShoppingList.create('user-123', '  Market  ');
    expect(list.name).toBe('Market');
  });

  it('should generate a unique id for each new ShoppingList', () => {
    const uuidSpy = jest.spyOn(crypto, 'randomUUID');
    ShoppingList.create('user-1', 'List 1');
    ShoppingList.create('user-2', 'List 2');
    expect(uuidSpy).toHaveBeenCalledTimes(2);
  });

  it('should reconstitute a ShoppingList with an existing id', () => {
    const now = new Date();
    const list = ShoppingList.reconstitute({
      id: 'existing-id',
      userId: 'user-1',
      name: 'Old List',
      createdAt: now,
      updatedAt: now,
    });

    expect(list.id).toBe('existing-id');
    expect(list.name).toBe('Old List');
  });
});
