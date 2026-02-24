import mongoose from "mongoose";
const CouponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true, index: true },
    type: { type: String, enum: ["percent", "fixed"], required: true },
    value: { type: Number, required: true },
    minOrderAmount: { type: Number, default: 0 },
    maxDiscount: { type: Number },
    expiresAt: { type: Date },
    isActive: { type: Boolean, default: true, index: true },
    usageLimit: { type: Number },
    usedCount: { type: Number, default: 0 }
}, { timestamps: true });
export const CouponModel = mongoose.models.Coupon || mongoose.model("Coupon", CouponSchema);
