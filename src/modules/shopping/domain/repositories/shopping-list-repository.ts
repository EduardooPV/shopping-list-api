import { ShoppingList } from 'modules/shopping/domain/entities/shopping-list';
import { IGetAllListsRequestDTO } from 'modules/shopping/application/get-all-lists/get-all-lists-dto';
import { IDeleteListByIdDTO } from 'modules/shopping/application/delete-list-by-id/delete-list-by-id-dto';
import { IPaginatedResponse } from 'shared/interfaces/paginated-response';
import { IUpdateListByIdDTO } from '../../application/update-list-by-id/update-list-by-id-dto';

interface IShoppingList {
  create(data: ShoppingList): Promise<ShoppingList>;
  getListById(id?: string): Promise<ShoppingList | null>;
  getAllLists(data: IGetAllListsRequestDTO): Promise<IPaginatedResponse<ShoppingList>>;
  deleteListById(data: IDeleteListByIdDTO): Promise<void>;
  updateListById(data: IUpdateListByIdDTO): Promise<ShoppingList>;
  getSumAmountItemsById(id?: string): Promise<number>;
  getDoneItemsById(id?: string): Promise<number>;
  getPendingItemsById(id?: string): Promise<number>;
}

export { IShoppingList };
