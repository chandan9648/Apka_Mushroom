import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";


export const getRazorpayKey = asyncHandler(async (req, res) => {
  if (!process.env.RAZORPAY_KEY_ID) {
    throw new ApiError(500, "Razorpay is not configured (missing RAZORPAY_KEY_ID)");
  }
  res.json({ keyId: process.env.RAZORPAY_KEY_ID });
});
