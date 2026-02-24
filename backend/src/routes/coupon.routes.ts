import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/requireAuth.js";
import {
  applyCoupon,
  listCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  ApplyCouponSchema,
  UpsertCouponSchema
} from "../controllers/coupon.controller.js";
import { validateBody } from "../middleware/validate.js";

export const couponRouter = Router();

couponRouter.post("/apply", validateBody(ApplyCouponSchema), applyCoupon);

couponRouter.get("/", requireAuth, requireRole("admin"), listCoupons);
couponRouter.post("/", requireAuth, requireRole("admin"), validateBody(UpsertCouponSchema), createCoupon);
couponRouter.put("/:id", requireAuth, requireRole("admin"), updateCoupon);
couponRouter.delete("/:id", requireAuth, requireRole("admin"), deleteCoupon);
