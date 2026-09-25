import { ICookieOptions } from 'core/http/interfaces/cookies-options';

export class CookieSerializer {
  public static serialize(name: string, value: string, opts: ICookieOptions = {}): string {
    const parts: string[] = [`${encodeURIComponent(name)}=${encodeURIComponent(value)}`];

    if (opts.maxAge !== undefined) parts.push(`Max-Age=${Math.max(0, Math.floor(opts.maxAge))}`);
    if (opts.domain != null) parts.push(`Domain=${opts.domain}`);
    if (opts.path != null) parts.push(`Path=${opts.path}`);
    if (opts.sameSite) parts.push(`SameSite=${opts.sameSite}`);
    if (opts.secure ?? false) parts.push('Secure');
    if (opts.httpOnly ?? false) parts.push('HttpOnly');

    return parts.join('; ');
  }
}
