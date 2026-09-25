import { InvalidUserIdError } from 'modules/users/domain/errors/invalid-user-id-error';
import { IDeleteListByIdDTO } from './delete-list-by-id-dto';
import { ListNotFound } from 'modules/shopping/domain/errors/list-not-found';
import { NoPermission } from 'shared/errors/no-permission';
import { IShoppingList } from 'modules/shopping/domain/repositories/shopping-list-repository';

class DeleteListByIdUseCase {
  constructor(private shoppingListRepository: IShoppingList) {}

  async execute(data: IDeleteListByIdDTO): Promise<void> {
    if (data.userId == null) throw new InvalidUserIdError({ reason: 'missing' });

    const listExist = await this.shoppingListRepository.getListById(data.id);

    if (listExist === null) throw new ListNotFound();

    if (listExist.userId !== data.userId) {
      throw new NoPermission();
    }

    await this.shoppingListRepository.deleteListById(data);
  }
}

export { DeleteListByIdUseCase };
