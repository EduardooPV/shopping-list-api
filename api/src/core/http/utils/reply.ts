import { ServerResponse } from 'http';
import { Headers } from 'core/http/interfaces/reply-responder';

class HeaderApplier {
  static apply(res: ServerResponse, headers?: Headers): void {
    if (!headers) return;
    for (const [key, value] of Object.entries(headers)) {
      res.setHeader(key, value);
    }
  }
}

class ReplyResponder {
  private readonly res: ServerResponse;

  constructor(res: ServerResponse) {
    this.res = res;
  }

  public json<T>(status: number, body: T, headers?: Headers): void {
    const payload = JSON.stringify(body);
    this.res.statusCode = status;
    this.res.setHeader('Content-Type', 'application/json; charset=utf-8');
    HeaderApplier.apply(this.res, headers);
    this.res.setHeader('Content-Length', Buffer.byteLength(payload).toString());
    this.res.end(payload);
  }

  public ok<T>(body: T, headers?: Headers): void {
    this.json(200, body, headers);
  }

  public created<T>(body: T, location?: string, headers?: Headers): void {
    if (location != null) {
      this.res.setHeader('Location', location);
    }
    this.json(201, body, headers);
  }

  public noContent(headers?: Headers): void {
    this.res.statusCode = 204;
    HeaderApplier.apply(this.res, headers);
    this.res.removeHeader('Content-Type');
    this.res.removeHeader('Content-Length');
    this.res.end();
  }

  public text(status: number, body: string, headers?: Headers): void {
    this.res.statusCode = status;
    this.res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    HeaderApplier.apply(this.res, headers);
    this.res.setHeader('Content-Length', Buffer.byteLength(body).toString());
    this.res.end(body);
  }

  public html(status: number, body: string, headers?: Headers): void {
    this.res.statusCode = status;
    this.res.setHeader('Content-Type', 'text/html; charset=utf-8');
    HeaderApplier.apply(this.res, headers);
    this.res.setHeader('Content-Length', Buffer.byteLength(body).toString());
    this.res.end(body);
  }
}

export { ReplyResponder };
