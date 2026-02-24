import { ApiError } from "../utils/apiError.js";
import { env } from "../config/env.js";
export function notFound(req, res) {
    res.status(404).json({ message: "Route not found" });
}
export function errorHandler(err, req, res, next) {
    const apiErr = err instanceof ApiError ? err : new ApiError(500, "Internal server error");
    const payload = {
        message: apiErr.message,
        code: apiErr.code
    };
    if (env.NODE_ENV !== "production") {
        payload.details = apiErr.details;
        payload.stack = err?.stack;
    }
    res.status(apiErr.status).json(payload);
}
