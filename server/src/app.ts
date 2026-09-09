import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import { authRouter } from "./auth/routes.js";
import { env, isProduction } from "./env.js";
import { errorHandler, notFound } from "./middleware/errors.js";

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  if (isProduction) app.set("trust proxy", 1);

  app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }));
  app.use(express.json({ limit: "16kb" }));
  app.use(cookieParser());

  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.use("/api/auth", authRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
