import { IncomingMessage, ServerResponse } from 'http';

class CorsMiddleware {
  static handle(req: IncomingMessage, res: ServerResponse, next: () => void): void {
    const origin = req.headers.origin ?? '';
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

    if (req.method === 'OPTIONS') {
      res.statusCode = 204;
      res.end();
      return;
    }
    next();
  }
}

export { CorsMiddleware };
