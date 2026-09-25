import { IBuildPaginationParams, IPaginatedResponse } from 'shared/interfaces/paginated-response';

export class Pagination {
  public static build<T>({
    items,
    total,
    page,
    perPage,
  }: IBuildPaginationParams<T>): IPaginatedResponse<T> {
    const totalPages = Math.ceil(total / perPage);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      items,
      pagination: {
        total,
        page,
        perPage,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    };
  }
}
