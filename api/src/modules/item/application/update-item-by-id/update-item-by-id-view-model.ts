import { ItemList } from 'modules/item/domain/entities/item-list';

interface IUpdateItemByIdViewModelResponse {
  name: string;
  id: string;
  status: string;
  quantity: number;
  amount: number;
}

class UpdateItemByIdViewModel {
  static toHTTP(item: ItemList): IUpdateItemByIdViewModelResponse {
    return {
      id: item.id,
      name: item.name,
      status: item.status,
      quantity: item.quantity,
      amount: item.amount,
    };
  }
}

export { UpdateItemByIdViewModel };
