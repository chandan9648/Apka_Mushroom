import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { ApiError } from "../utils/apiError.js";
export function requireAuth(req, res, next) {
    const header = req.headers.authorization;
    const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
    if (!token)
        return next(new ApiError(401, "Missing auth token"));
    try {
        const payload = jwt.verify(token, env.JWT_ACCESS_SECRET);
        req.auth = payload;
        next();
    }
    catch {
        next(new ApiError(401, "Invalid or expired token"));
    }
}
export function requireRole(role) {
    return (req, res, next) => {
        if (!req.auth)
            return next(new ApiError(401, "Unauthorized"));
        if (req.auth.role !== role)
            return next(new ApiError(403, "Forbidden"));
        next();
    };
}
