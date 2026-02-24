import { z } from "zod";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { UserModel } from "../models/User.js";
import { OtpTokenModel } from "../models/OtpToken.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { randomNumericCode, sha256 } from "../utils/crypto.js";
import { signAccessToken, signRefreshToken } from "../utils/jwt.js";
import { env } from "../config/env.js";

const emailSchema = z.string().email().transform((v) => v.toLowerCase());

export const SignupSchema = z.object({
  name: z.string().min(2),
  email: emailSchema,
  password: z.string().min(8)
});

export const LoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1)
});

export const VerifyEmailSchema = z.object({
  email: emailSchema,
  code: z.string().min(4).max(10)
});

export const ForgotPasswordSchema = z.object({
  email: emailSchema
});

export const ResetPasswordSchema = z.object({
  email: emailSchema,
  code: z.string().min(4).max(10),
  newPassword: z.string().min(8)
});

export const RefreshSchema = z.object({
  refreshToken: z.string().min(20)
});

function otpExpiresAt() {
  return new Date(Date.now() + env.OTP_TTL_MINUTES * 60_000);
}

async function issueOtp(userId: string, purpose: "verify_email" | "reset_password") {
  const code = randomNumericCode(6);
  const codeHash = sha256(code);

  await OtpTokenModel.deleteMany({ userId, purpose });
  await OtpTokenModel.create({ userId, purpose, codeHash, expiresAt: otpExpiresAt() });

  // Dev-only OTP delivery: log to console.
  // eslint-disable-next-line no-console
  console.log(`[OTP:${purpose}] user=${userId} code=${code}`);

  return code;
}

export const signup = asyncHandler(async (req, res) => {
  const body = SignupSchema.parse(req.body);

  const existing = await UserModel.findOne({ email: body.email });
  if (existing) throw new ApiError(409, "Email already in use");

  const user = await UserModel.create({
    name: body.name,
    email: body.email,
    passwordHash: await hashPassword(body.password),
    role: "user",
    isEmailVerified: false
  });

  await issueOtp(user._id.toString(), "verify_email");

  res.status(201).json({
    message: "Account created. Please verify email with OTP.",
    user: { id: user._id, name: user.name, email: user.email, role: user.role, isEmailVerified: user.isEmailVerified }
  });
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const body = VerifyEmailSchema.parse(req.body);

  const user = await UserModel.findOne({ email: body.email });
  if (!user) throw new ApiError(404, "User not found");

  const token = await OtpTokenModel.findOne({ userId: user._id, purpose: "verify_email" });
  if (!token) throw new ApiError(400, "OTP not found or expired");

  if (token.expiresAt.getTime() < Date.now()) throw new ApiError(400, "OTP expired");

  if (sha256(body.code) !== token.codeHash) throw new ApiError(400, "Invalid OTP");

  user.isEmailVerified = true;
  await user.save();
  await OtpTokenModel.deleteMany({ userId: user._id, purpose: "verify_email" });

  res.json({ message: "Email verified" });
});

export const login = asyncHandler(async (req, res) => {
  const body = LoginSchema.parse(req.body);

  const user = await UserModel.findOne({ email: body.email });
  if (!user) throw new ApiError(401, "Invalid credentials");

  const ok = await verifyPassword(body.password, user.passwordHash);
  if (!ok) throw new ApiError(401, "Invalid credentials");

  if (!user.isEmailVerified) {
    await issueOtp(user._id.toString(), "verify_email");
    throw new ApiError(403, "Email not verified. OTP re-sent.", { code: "EMAIL_NOT_VERIFIED" });
  }

  const accessToken = signAccessToken({ sub: user._id.toString(), role: user.role });
  const refreshToken = signRefreshToken({ sub: user._id.toString(), role: user.role });

  res.json({
    accessToken,
    refreshToken,
    user: { id: user._id, name: user.name, email: user.email, role: user.role, isEmailVerified: user.isEmailVerified }
  });
});

export const refresh = asyncHandler(async (req, res) => {
  const body = RefreshSchema.parse(req.body);
  const jwt = await import("jsonwebtoken");

  try {
    const payload = jwt.default.verify(body.refreshToken, env.JWT_REFRESH_SECRET) as any;
    const accessToken = signAccessToken({ sub: payload.sub, role: payload.role });
    res.json({ accessToken });
  } catch {
    throw new ApiError(401, "Invalid refresh token");
  }
});

export const me = asyncHandler(async (req, res) => {
  if (!req.auth) throw new ApiError(401, "Unauthorized");
  const user = await UserModel.findById(req.auth.sub).select("name email role isEmailVerified wishlist addresses");
  if (!user) throw new ApiError(404, "User not found");
  res.json({ user });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const body = ForgotPasswordSchema.parse(req.body);

  const user = await UserModel.findOne({ email: body.email });
  if (!user) {
    return res.json({ message: "If that email exists, OTP has been sent." });
  }

  await issueOtp(user._id.toString(), "reset_password");
  res.json({ message: "OTP generated for password reset" });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const body = ResetPasswordSchema.parse(req.body);

  const user = await UserModel.findOne({ email: body.email });
  if (!user) throw new ApiError(404, "User not found");

  const token = await OtpTokenModel.findOne({ userId: user._id, purpose: "reset_password" });
  if (!token) throw new ApiError(400, "OTP not found or expired");
  if (token.expiresAt.getTime() < Date.now()) throw new ApiError(400, "OTP expired");
  if (sha256(body.code) !== token.codeHash) throw new ApiError(400, "Invalid OTP");

  user.passwordHash = await hashPassword(body.newPassword);
  await user.save();
  await OtpTokenModel.deleteMany({ userId: user._id, purpose: "reset_password" });

  res.json({ message: "Password updated" });
});
