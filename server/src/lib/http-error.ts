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

export const forbidden = () =>
  new HttpError(403, "forbidden", "Only a manager can do this");

export const invalidCredentials = () =>
  new HttpError(401, "invalid_credentials", "Invalid email or password");

export const wrongPassword = () =>
  new HttpError(400, "wrong_password", "Current password is not right", {
    currentPassword: "That is not your current password",
  });

export const emailTaken = () =>
  new HttpError(409, "email_taken", "That email is already registered");

export const invalidResetToken = () =>
  new HttpError(
    400,
    "invalid_token",
    "That reset link is invalid or has expired. Request a new one.",
  );

export const googleNotConfigured = () =>
  new HttpError(
    503,
    "google_not_configured",
    "Google sign-in is not configured on this server",
  );

export const wrongCode = () =>
  new HttpError(400, "wrong_code", "That code is not right", {
    code: "Check the 6 digits in your authenticator app",
  });

export const twoFactorAlreadyOn = () =>
  new HttpError(409, "two_factor_on", "Two-factor authentication is already on");

export const invalidTicket = () =>
  new HttpError(401, "invalid_ticket", "Sign in again to continue");
