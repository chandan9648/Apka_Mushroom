import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError.js";
import { env } from "../config/env.js";

export function notFound(req: Request, res: Response) {
  res.status(404).json({ message: "Route not found" });
}

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  const apiErr = err instanceof ApiError ? err : new ApiError(500, "Internal server error");
  const payload: any = {
    message: apiErr.message,
    code: apiErr.code
  };

  if (env.NODE_ENV !== "production") {
    payload.details = apiErr.details;
    payload.stack = (err as any)?.stack;
  }

  res.status(apiErr.status).json(payload);
}
