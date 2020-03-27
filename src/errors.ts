export abstract class CustomError extends Error {
  constructor(message: string, public internalMessage?: string) {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = this.constructor.name;
    this.message = message;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class CannotRenderOnServerError extends CustomError {
  constructor(message: string) {
    super(message);
  }
}
