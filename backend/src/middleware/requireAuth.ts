import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { ApiError } from "../utils/apiError.js";

export type JwtPayload = {
  sub: string;
  role: "user" | "admin";
};

declare global {
  namespace Express {
    interface Request {
      auth?: JwtPayload;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;

  if (!token) return next(new ApiError(401, "Missing auth token"));

  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
    req.auth = payload;
    next();
  } catch {
    next(new ApiError(401, "Invalid or expired token"));
  }
}

export function requireRole(role: JwtPayload["role"]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.auth) return next(new ApiError(401, "Unauthorized"));
    if (req.auth.role !== role) return next(new ApiError(403, "Forbidden"));
    next();
  };
}
