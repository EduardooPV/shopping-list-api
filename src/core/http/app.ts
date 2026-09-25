import http, { IncomingMessage, ServerResponse, Server } from 'http';
import { LoggerMiddleware } from 'core/http/middlewares/logger';
import { router } from './';
import { HttpErrorHandler } from 'core/http/utils/handle-http-error';
import { MetricsRecorderMiddleware } from 'core/http/middlewares/metrics-recorder';
import { ErrorMiddleware } from 'core/http/middlewares/error';
import { CorsMiddleware } from './middlewares/cors';

class App {
  private server: Server;

  constructor() {
    this.server = http.createServer(this.requestListener.bind(this));
    this.configureServer();
  }

  private configureServer(): void {
    this.server.requestTimeout = 10_000;
    this.server.headersTimeout = 12_000;
    this.server.keepAliveTimeout = 5_000;
    this.server.maxRequestsPerSocket = 100;
  }

  private async requestListener(request: IncomingMessage, response: ServerResponse): Promise<void> {
    try {
      const { url, method } = request;

      if (url == null || method == null) {
        response.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        response.end(JSON.stringify({ error: { message: 'Bad Request: URL or Method missing' } }));
        return;
      }

      await CorsMiddleware.handle(request, response, async () => {
        await ErrorMiddleware.handle(request, response, async () => {
          await MetricsRecorderMiddleware.handle(request, response, async () => {
            LoggerMiddleware.handle(request, response);
            await router.resolve(request, response);
          });
        });
      });
    } catch (error) {
      if (response.headersSent) {
        console.error('Error after headers sent. Destroying socket.', error);
        response.destroy();
        return;
      }
      HttpErrorHandler.handle(error, response);
    }
  }

  public start(port: number): void {
    this.server.listen(port, '0.0.0.0', () => {
      console.log(`🚀 Server is running on http://localhost:${port}`);
    });
  }
}

export { App };
