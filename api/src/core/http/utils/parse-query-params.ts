import { IncomingMessage } from 'http';

class QueryParser {
  static parse<T = unknown>(request: IncomingMessage): Partial<T> {
    const base = `http://${request.headers.host}`;

    if (request.url == null) {
      return {} as Partial<T>;
    }

    const url = new URL(request.url, base);
    const query: Record<string, string> = {};

    url.searchParams.forEach((value, key) => {
      query[key] = value;
    });

    return query as Partial<T>;
  }
}

export { QueryParser };
