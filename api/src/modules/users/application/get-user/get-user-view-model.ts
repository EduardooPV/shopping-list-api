import { User } from 'modules/users/domain/entities/user';

interface IGetUserViewModelResponse {
  name: string;
  email: string;
}

class GetUserViewModel {
  static toHTTP(user: User): IGetUserViewModelResponse {
    return {
      name: user.name,
      email: user.email,
    };
  }
}

export { GetUserViewModel };
