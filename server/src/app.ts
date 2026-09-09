import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import { analyticsRouter } from "./analytics/routes.js";
import { authRouter } from "./auth/routes.js";
import { clientOrigins, isProduction } from "./env.js";
import { guestRouter } from "./guest/routes.js";
import { settingsRouter } from "./hotels/routes.js";
import { errorHandler, notFound } from "./middleware/errors.js";
import { requestsRouter } from "./requests/routes.js";
import { roomsRouter } from "./rooms/routes.js";
import { teamRouter } from "./team/routes.js";

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  if (isProduction) app.set("trust proxy", 1);

  app.use(cors({ origin: clientOrigins, credentials: true }));
  app.use(express.json({ limit: "64kb" }));
  app.use(cookieParser());

  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.use("/api/auth", authRouter);
  app.use("/api/settings", settingsRouter);
  app.use("/api/rooms", roomsRouter);
  app.use("/api/requests", requestsRouter);
  app.use("/api/team", teamRouter);
  app.use("/api/analytics", analyticsRouter);
  app.use("/api/guest/:token", guestRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
