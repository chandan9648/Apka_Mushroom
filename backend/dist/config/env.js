import dotenv from "dotenv";
import { z } from "zod";
dotenv.config();
const EnvSchema = z.object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    PORT: z.coerce.number().default(3000),
    CLIENT_ORIGIN: z.string().default("http://localhost:3000"),
    MONGODB_URI: z.string().min(1),
    JWT_ACCESS_SECRET: z.string().min(16),
    JWT_REFRESH_SECRET: z.string().min(16),
    JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
    JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),
    RAZORPAY_KEY_ID: z.string().min(1),
    RAZORPAY_KEY_SECRET: z.string().min(1),
    UPLOADS_DIR: z.string().default("src/uploads"),
    MAX_UPLOAD_MB: z.coerce.number().default(10),
    OTP_TTL_MINUTES: z.coerce.number().default(10)
});
export const env = EnvSchema.parse({
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    CLIENT_ORIGIN: process.env.CLIENT_ORIGIN,
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN,
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,
    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
    UPLOADS_DIR: process.env.UPLOADS_DIR,
    MAX_UPLOAD_MB: process.env.MAX_UPLOAD_MB,
    OTP_TTL_MINUTES: process.env.OTP_TTL_MINUTES
});
