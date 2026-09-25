import { IncomingMessage } from 'http';

class BodyParser {
  private static readonly MAX_BODY_SIZE = 1e6;

  static async parse(request: IncomingMessage): Promise<object> {
    const contentType = request.headers['content-type'];
    if (!(contentType?.includes('application/json') ?? false)) {
      return {};
    }

    return new Promise((resolve, reject) => {
      let body = '';

      request.on('data', (chunk) => {
        body += chunk;
        if (body.length > BodyParser.MAX_BODY_SIZE) {
          request.destroy();
          return reject(new Error('Payload too large'));
        }
      });

      request.on('end', () => {
        try {
          if (!body) return resolve({});
          resolve(JSON.parse(body));
        } catch {
          reject(new SyntaxError('Invalid JSON'));
        }
      });
    });
  }
}

export { BodyParser };
