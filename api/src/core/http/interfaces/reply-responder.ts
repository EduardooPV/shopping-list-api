type Headers = Record<string, string>;

interface Responder {
  json: <T>(status: number, body: T, headers?: Headers) => void;
  ok: <T>(body: T, headers?: Headers) => void;
  created: <T>(body: T, location?: string, headers?: Headers) => void;
  noContent: (headers?: Headers) => void;
  text: (status: number, body: string, headers?: Headers) => void;
  html: (status: number, body: string, headers?: Headers) => void;
}

export { Headers, Responder };
