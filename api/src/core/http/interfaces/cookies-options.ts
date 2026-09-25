type SameSite = 'Strict' | 'Lax' | 'None';

interface ICookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  path?: string;
  domain?: string;
  maxAge?: number;
  sameSite?: SameSite;
}

export { ICookieOptions };
