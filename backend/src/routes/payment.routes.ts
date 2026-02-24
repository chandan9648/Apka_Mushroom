import { Router } from "express";
import { getRazorpayKey } from "../controllers/payment.controller.js";

export const paymentRouter = Router();

paymentRouter.get("/razorpay/key", getRazorpayKey);
