import { ItemList } from 'modules/item/domain/entities/item-list';

interface ICreateItemViewModelResponse {
  name: string;
  id: string;
  status: string;
  quantity: number;
  amount: number;
}

class CreateItemViewModel {
  static toHTTP(item: ItemList): ICreateItemViewModelResponse {
    return {
      id: item.id,
      name: item.name,
      status: item.status,
      quantity: item.quantity,
      amount: item.amount,
    };
  }
}

export { CreateItemViewModel };
