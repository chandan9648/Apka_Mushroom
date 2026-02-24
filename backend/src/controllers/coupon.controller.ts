import { z } from "zod";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { CouponModel } from "../models/Coupon.js";
import { computeDiscount } from "../utils/coupon.js";

export const UpsertCouponSchema = z.object({
  code: z.string().min(3).transform((v) => v.toUpperCase()),
  type: z.enum(["percent", "fixed"]),
  value: z.number().positive(),
  minOrderAmount: z.number().nonnegative().optional(),
  maxDiscount: z.number().positive().optional(),
  expiresAt: z.string().datetime().optional(),
  isActive: z.boolean().optional(),
  usageLimit: z.number().int().positive().optional()
});

export const ApplyCouponSchema = z.object({
  code: z.string().min(3),
  subtotal: z.number().nonnegative()
});

export const applyCoupon = asyncHandler(async (req, res) => {
  const body = ApplyCouponSchema.parse(req.body);
  const { coupon, discount } = await computeDiscount(body.code, body.subtotal);
  if (!coupon) throw new ApiError(400, "Invalid coupon");
  res.json({ discount, coupon: { code: coupon.code, type: coupon.type, value: coupon.value } });
});

export const listCoupons = asyncHandler(async (req, res) => {
  const items = await CouponModel.find().sort({ createdAt: -1 });
  res.json({ items });
});

export const createCoupon = asyncHandler(async (req, res) => {
  const body = UpsertCouponSchema.parse(req.body);
  const exists = await CouponModel.findOne({ code: body.code });
  if (exists) throw new ApiError(409, "Coupon already exists");

  const coupon = await CouponModel.create({
    ...body,
    expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined,
    minOrderAmount: body.minOrderAmount ?? 0,
    isActive: body.isActive ?? true
  });

  res.status(201).json({ coupon });
});

export const updateCoupon = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const body = UpsertCouponSchema.partial().parse(req.body);

  const coupon = await CouponModel.findById(id);
  if (!coupon) throw new ApiError(404, "Coupon not found");

  if (body.code) coupon.code = body.code;
  if (body.type) coupon.type = body.type;
  if (body.value != null) coupon.value = body.value;
  if (body.minOrderAmount != null) coupon.minOrderAmount = body.minOrderAmount;
  if (body.maxDiscount !== undefined) coupon.maxDiscount = body.maxDiscount;
  if (body.expiresAt !== undefined) coupon.expiresAt = body.expiresAt ? new Date(body.expiresAt) : undefined;
  if (body.isActive !== undefined) coupon.isActive = body.isActive;
  if (body.usageLimit !== undefined) coupon.usageLimit = body.usageLimit;

  await coupon.save();
  res.json({ coupon });
});

export const deleteCoupon = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const coupon = await CouponModel.findByIdAndDelete(id);
  if (!coupon) throw new ApiError(404, "Coupon not found");
  res.json({ ok: true });
});
