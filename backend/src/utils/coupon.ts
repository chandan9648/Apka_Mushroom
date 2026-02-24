import { CouponModel } from "../models/Coupon.js";

export async function computeDiscount(code: string | undefined, subtotal: number) {
  if (!code) return { coupon: null as any, discount: 0 };

  const coupon = await CouponModel.findOne({ code: code.toUpperCase(), isActive: true });
  if (!coupon) return { coupon: null as any, discount: 0 };

  if (coupon.expiresAt && coupon.expiresAt.getTime() < Date.now()) return { coupon: null as any, discount: 0 };
  if (coupon.usageLimit != null && coupon.usedCount >= coupon.usageLimit) return { coupon: null as any, discount: 0 };
  if (subtotal < coupon.minOrderAmount) return { coupon: null as any, discount: 0 };

  let discount = 0;
  if (coupon.type === "percent") {
    discount = Math.round((subtotal * coupon.value) / 100);
  } else {
    discount = Math.round(coupon.value);
  }

  if (coupon.maxDiscount != null) discount = Math.min(discount, coupon.maxDiscount);
  discount = Math.max(0, Math.min(discount, subtotal));

  return { coupon, discount };
}
