import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
function toExpiresIn(value) {
    if (/^\d+$/.test(value))
        return Number(value);
    return value;
}
export function signAccessToken(payload) {
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: toExpiresIn(env.JWT_ACCESS_EXPIRES_IN) });
}
export function signRefreshToken(payload) {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: toExpiresIn(env.JWT_REFRESH_EXPIRES_IN) });
}
