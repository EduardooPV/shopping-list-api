import { IncomingMessage } from 'http';

interface IPaginationResponse {
  page: number;
  perPage: number;
  skip: number;
  take: number;
}

interface IPaginationParams {
  request: IncomingMessage;
  defaultPerPage?: number;
  maxPerPage?: number;
}

export { IPaginationResponse, IPaginationParams };
