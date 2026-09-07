export interface ActionError {
  code: string;
  message: string;
  fields?: Record<string, string>;
}

export type Result<T> =
  { ok: true; data: T } | { ok: false; error: ActionError };
