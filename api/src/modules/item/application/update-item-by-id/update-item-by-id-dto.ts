import { ItemStatus } from 'modules/item/domain/value-objects/item-status';

interface IUpdateItemByIdRequestDTO {
  shoppingListId?: string;
  itemId?: string;
  userId?: string;

  name?: string;
  status?: ItemStatus;
  amount?: number;
  quantity?: number;
}

interface IUpdateItemByIdDTO {
  shoppingListId?: string;
  itemId?: string;
  userId?: string;

  name?: string;
  status?: ItemStatus;
  amount?: number;
  quantity?: number;
}

export { IUpdateItemByIdRequestDTO, IUpdateItemByIdDTO };
