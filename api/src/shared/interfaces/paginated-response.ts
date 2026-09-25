interface IPaginatedResponse<T> {
  items: T[];
  pagination: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

interface IBuildPaginationParams<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
}

export { IPaginatedResponse, IBuildPaginationParams };
