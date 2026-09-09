export type FieldErrors = Record<string, string>;

export class HttpError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly fields?: FieldErrors,
  ) {
    super(message);
  }
}

export const badRequest = (message: string, fields?: FieldErrors) =>
  new HttpError(400, "invalid_input", message, fields);

export const unauthenticated = () =>
  new HttpError(401, "unauthenticated", "Sign in to continue");

export const invalidCredentials = () =>
  new HttpError(401, "invalid_credentials", "Invalid email or password");

export const emailTaken = () =>
  new HttpError(409, "email_taken", "That email is already registered");
