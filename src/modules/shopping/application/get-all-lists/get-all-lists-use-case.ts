import { ShoppingList } from 'modules/shopping/domain/entities/shopping-list';
import { IGetAllListsRequestDTO } from './get-all-lists-dto';
import { IPaginatedResponse } from 'shared/interfaces/paginated-response';
import { IShoppingList } from 'modules/shopping/domain/repositories/shopping-list-repository';

class GetAllListsUseCase {
  constructor(private shoppingListRepository: IShoppingList) {}

  async execute(data: IGetAllListsRequestDTO): Promise<IPaginatedResponse<ShoppingList>> {
    return await this.shoppingListRepository.getAllLists(data);
  }
}

export { GetAllListsUseCase };
