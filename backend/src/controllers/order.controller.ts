import { z } from "zod";
import Razorpay from "razorpay";
import crypto from "crypto";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { OrderModel } from "../models/Order.js";
import { ProductModel } from "../models/Product.js";
import { computeDiscount } from "../utils/coupon.js";

import { CouponModel } from "../models/Coupon.js";

const AddressSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(7),
  line1: z.string().min(2),
  line2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  postalCode: z.string().min(3),
  country: z.string().default("IN")
});

export const CreateOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1)
      })
    )
    .min(1),
  address: AddressSchema,
  couponCode: z.string().optional()
});

export const VerifyRazorpaySchema = z.object({
  orderId: z.string().min(1),
  razorpayOrderId: z.string().min(1),
  razorpayPaymentId: z.string().min(1),
  razorpaySignature: z.string().min(1)
});

function verifySignature(razorpayOrderId: string, razorpayPaymentId: string, signature: string, keySecret: string) {
  const body = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expected = crypto.createHmac("sha256", keySecret).update(body).digest("hex");
  return expected === signature;
}

let razorpayClient: Razorpay | null = null;

function getRazorpayClient() {
  if (razorpayClient) return razorpayClient;

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    throw new ApiError(500, "Razorpay is not configured (missing RAZORPAY_KEY_ID/RAZORPAY_KEY_SECRET)");
  }

  razorpayClient = new Razorpay({ key_id: keyId, key_secret: keySecret });
  return razorpayClient;
}

export const createOrder = asyncHandler(async (req, res) => {
  if (!req.auth) throw new ApiError(401, "Unauthorized");
  const body = CreateOrderSchema.parse(req.body);

  const productIds = body.items.map((i) => i.productId);
  const products = await ProductModel.find({ _id: { $in: productIds }, isActive: true });

  if (products.length !== productIds.length) throw new ApiError(400, "Some products are unavailable");

  let subtotal = 0;
  const orderItems = body.items.map((i) => {
    const p = products.find((x) => x._id.toString() === i.productId);
    if (!p) throw new ApiError(400, "Invalid product");
    if (p.stock < i.quantity) throw new ApiError(409, `Insufficient stock for ${p.name}`);

    subtotal += p.price * i.quantity;
    return {
      product: p._id,
      name: p.name,
      price: p.price,
      quantity: i.quantity,
      image: p.images?.[0]
    };
  });

  const { coupon, discount } = await computeDiscount(body.couponCode, subtotal);
  const total = Math.max(0, subtotal - discount);

  const order = await OrderModel.create({
    user: req.auth.sub,
    items: orderItems,
    address: body.address,
    subtotal,
    discount,
    total,
    coupon: coupon?._id,
    status: "pending_payment",
    paymentProvider: "razorpay"
  });

  const razorpay = getRazorpayClient();
  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(total * 100),
    currency: "INR",
    receipt: `order_${order._id}`
  });

  order.razorpayOrderId = razorpayOrder.id;
  await order.save();

  res.status(201).json({
    order,
    razorpay: { keyId: process.env.RAZORPAY_KEY_ID, orderId: razorpayOrder.id, amount: razorpayOrder.amount, currency: razorpayOrder.currency }
  });
});

export const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  if (!req.auth) throw new ApiError(401, "Unauthorized");
  const body = VerifyRazorpaySchema.parse(req.body);

  const order = await OrderModel.findOne({ _id: body.orderId, user: req.auth.sub });
  if (!order) throw new ApiError(404, "Order not found");

  if (order.status === "paid") return res.json({ ok: true, order });
  if (order.razorpayOrderId !== body.razorpayOrderId) throw new ApiError(400, "Mismatched Razorpay order");

  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) throw new ApiError(500, "Razorpay is not configured (missing RAZORPAY_KEY_SECRET)");

  const ok = verifySignature(body.razorpayOrderId, body.razorpayPaymentId, body.razorpaySignature, keySecret);
  if (!ok) throw new ApiError(400, "Invalid payment signature");

  order.status = "paid";
  order.razorpayPaymentId = body.razorpayPaymentId;
  order.razorpaySignature = body.razorpaySignature;
  order.paidAt = new Date();
  await order.save();

  // Decrement stock + emit socket updates
  for (const item of order.items) {
    const p = await ProductModel.findById(item.product);
    if (!p) continue;
    p.stock = Math.max(0, p.stock - item.quantity);
    await p.save();
    const io = req.app.get("io");
    io.emit("stock:update", { productId: p._id.toString(), stock: p.stock });
  }

  if (order.coupon) {
    await CouponModel.updateOne({ _id: order.coupon }, { $inc: { usedCount: 1 } });
  }

  res.json({ ok: true, order });
});

export const listMyOrders = asyncHandler(async (req, res) => {
  if (!req.auth) throw new ApiError(401, "Unauthorized");
  const items = await OrderModel.find({ user: req.auth.sub }).sort({ createdAt: -1 }).limit(50);
  res.json({ items });
});

export const adminListOrders = asyncHandler(async (req, res) => {
  const items = await OrderModel.find().populate("user", "name email").sort({ createdAt: -1 }).limit(200);
  res.json({ items });
});

export const adminUpdateOrderStatusSchema = z.object({
  status: z.enum(["pending_payment", "paid", "packed", "shipped", "delivered", "cancelled"])
});

export const adminUpdateOrderStatus = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const body = adminUpdateOrderStatusSchema.parse(req.body);
  const order = await OrderModel.findById(id);
  if (!order) throw new ApiError(404, "Order not found");
  order.status = body.status;
  await order.save();
  res.json({ order });
});
