import { rateLimit } from "express-rate-limit";

const MINUTE_MS = 60_000;

const message = {
  error: {
    code: "rate_limited",
    message: "Too many attempts. Try again in a few minutes.",
  },
};

export const authLimiter = rateLimit({
  windowMs: 15 * MINUTE_MS,
  limit: 30,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message,
});

export const guestWriteLimiter = rateLimit({
  windowMs: 60 * MINUTE_MS,
  limit: 60,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  keyGenerator: (req) =>
    `${req.ip ?? "unknown"}:${String(req.params.token ?? "")}`,
  message,
});
