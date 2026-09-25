class AppError extends Error {
  public readonly code: string;
  public readonly details?: unknown;
  public readonly isOperational = true;

  constructor(code: string, message: string, details?: unknown) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.details = details;

    Object.setPrototypeOf(this, new.target.prototype);

    Error.captureStackTrace(this, this.constructor);
  }
}

export { AppError };
