import { asyncHandler } from "../utils/asyncHandler.js";


export const getRazorpayKey = asyncHandler(async (req, res) => {
  res.json({ keyId: process.env.RAZORPAY_KEY_ID });
});
