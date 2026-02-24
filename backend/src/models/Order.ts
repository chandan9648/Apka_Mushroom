import mongoose, { type InferSchemaType } from "mongoose";

const OrderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String }
  },
  { _id: false }
);

const AddressSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    line1: { type: String, required: true },
    line2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, default: "IN" }
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    items: { type: [OrderItemSchema], required: true },
    address: { type: AddressSchema, required: true },

    status: {
      type: String,
      enum: ["pending_payment", "paid", "packed", "shipped", "delivered", "cancelled"],
      default: "pending_payment",
      index: true
    },

    currency: { type: String, default: "INR" },
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },

    coupon: { type: mongoose.Schema.Types.ObjectId, ref: "Coupon" },

    paymentProvider: { type: String, enum: ["razorpay"], default: "razorpay" },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    paidAt: { type: Date }
  },
  { timestamps: true }
);

export type Order = InferSchemaType<typeof OrderSchema>;

export const OrderModel = mongoose.models.Order || mongoose.model("Order", OrderSchema);
