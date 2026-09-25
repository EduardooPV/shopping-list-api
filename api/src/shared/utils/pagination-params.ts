import { IPaginationParams, IPaginationResponse } from 'shared/interfaces/pagination-params';

export class PaginationHelper {
  private static clamp(n: number, min: number, max: number): number {
    if (Number.isNaN(n)) {
      return min;
    }
    return Math.max(min, Math.min(n, max));
  }

  public static fromRequest({
    request,
    defaultPerPage = 10,
    maxPerPage = 10,
  }: IPaginationParams): IPaginationResponse {
    const url = new URL(request.url ?? '/', 'http://localhost');

    const pageRaw = url.searchParams.get('page');
    const perPageRaw = url.searchParams.get('per_page') ?? url.searchParams.get('perPage');

    const page = this.clamp(parseInt(pageRaw ?? '1', 10), 1, Number.MAX_SAFE_INTEGER);
    const perPage = this.clamp(parseInt(perPageRaw ?? String(defaultPerPage), 10), 1, maxPerPage);

    return {
      page,
      perPage,
      skip: (page - 1) * perPage,
      take: perPage,
    };
  }
}
