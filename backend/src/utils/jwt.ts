import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function signAccessToken(payload: { sub: string; role: "user" | "admin" }) {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: env.JWT_ACCESS_EXPIRES_IN });
}

export function signRefreshToken(payload: { sub: string; role: "user" | "admin" }) {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES_IN });
}
