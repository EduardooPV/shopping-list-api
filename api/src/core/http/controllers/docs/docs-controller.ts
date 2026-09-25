import { IncomingMessage, ServerResponse } from 'http';
import { ReplyResponder } from 'core/http/utils/reply';

class DocsHtmlBuilder {
  public static build(): string {
    return `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>

          <title>API Docs</title>

          <style>body{margin:0}</style>
        </head>

        <body>
          <div id="app"></div>
          <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
          <script>
            Scalar.createApiReference('#app', {
              theme: 'purple',
              layout: 'modern',
              url: '/openapi.json' 
            })
          </script>
        </body>
      </html>
    `;
  }
}

class DocsController {
  public async handle(_req: IncomingMessage, res: ServerResponse): Promise<void> {
    const html = DocsHtmlBuilder.build();
    new ReplyResponder(res).text(200, html, {
      'Content-Type': 'text/html; charset=utf-8',
    });
  }
}

export { DocsController };
