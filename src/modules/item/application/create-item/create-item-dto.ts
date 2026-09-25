import { ItemStatus } from 'modules/item/domain/value-objects/item-status';

interface ICreateItemRequestDTO {
  name: string;
  shoppingListId?: string;
  userId?: string;
  status: ItemStatus;
  quantity: number;
  amount: number;
}

export { ICreateItemRequestDTO };
