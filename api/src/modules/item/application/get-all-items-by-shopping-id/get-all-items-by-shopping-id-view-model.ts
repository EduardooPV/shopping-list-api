import { ItemList } from 'modules/item/domain/entities/item-list';

interface IGetAllItemsByShoppingIdViewModelResponse {
  name: string;
  id: string;
  status: string;
  quantity: number;
  amount: number;
}

class GetAllItemsByShoppingIdViewModel {
  static toHTTP(item: ItemList): IGetAllItemsByShoppingIdViewModelResponse {
    return {
      id: item.id,
      name: item.name,
      status: item.status,
      quantity: item.quantity,
      amount: item.amount,
    };
  }
}

export { GetAllItemsByShoppingIdViewModel };
