import type { ErrorRequestHandler, RequestHandler } from "express";

import { isProduction } from "../env.js";
import { HttpError } from "../lib/http-error.js";

export const notFound: RequestHandler = (req, res) => {
  res.status(404).json({
    error: {
      code: "not_found",
      message: `No route for ${req.method} ${req.path}`,
    },
  });
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof HttpError) {
    res.status(error.status).json({
      error: { code: error.code, message: error.message, fields: error.fields },
    });
    return;
  }

  if (!isProduction) console.error(error);

  res.status(500).json({
    error: { code: "internal", message: "Something went wrong" },
  });
};
