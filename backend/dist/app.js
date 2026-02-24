import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";
import { env } from "./config/env.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import { authRouter } from "./routes/auth.routes.js";
import { productRouter } from "./routes/product.routes.js";
import { categoryRouter } from "./routes/category.routes.js";
import { orderRouter } from "./routes/order.routes.js";
import { reviewRouter } from "./routes/review.routes.js";
import { couponRouter } from "./routes/coupon.routes.js";
import { adminRouter } from "./routes/admin.routes.js";
import { paymentRouter } from "./routes/payment.routes.js";
import { recommendationRouter } from "./routes/recommendation.routes.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export function createApp() {
    const app = express();
    app.set("trust proxy", 1);
    app.use(helmet());
    app.use(compression());
    app.use(cookieParser());
    app.use(express.json({ limit: "2mb" }));
    app.use(express.urlencoded({ extended: true }));
    app.use(cors({
        origin: env.CLIENT_ORIGIN,
        credentials: true
    }));
    app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
    app.use(rateLimit({
        windowMs: 60_000,
        limit: 120,
        standardHeaders: true,
        legacyHeaders: false
    }));
    app.get("/api/health", (req, res) => {
        res.json({ ok: true, name: "fungiverse-api" });
    });
    app.use("/api/auth", authRouter);
    app.use("/api/categories", categoryRouter);
    app.use("/api/products", productRouter);
    app.use("/api/orders", orderRouter);
    app.use("/api/reviews", reviewRouter);
    app.use("/api/coupons", couponRouter);
    app.use("/api/admin", adminRouter);
    app.use("/api/payments", paymentRouter);
    app.use("/api/recommendations", recommendationRouter);
    const uploadsDir = path.resolve(__dirname, env.UPLOADS_DIR);
    app.use("/uploads", express.static(uploadsDir));
    app.use(notFound);
    app.use(errorHandler);
    return app;
}
