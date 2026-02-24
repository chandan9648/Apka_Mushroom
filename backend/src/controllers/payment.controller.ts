import { asyncHandler } from "../utils/asyncHandler.js";
import { env } from "../config/env.js";

export const getRazorpayKey = asyncHandler(async (req, res) => {
  res.json({ keyId: env.RAZORPAY_KEY_ID });
});
