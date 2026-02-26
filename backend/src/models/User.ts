import mongoose, { type InferSchemaType } from "mongoose";

//address subdocument schema
const AddressSchema = new mongoose.Schema(
  {
    label: { type: String },
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

//main user schema
const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    password: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user", index: true },
    isEmailVerified: { type: Boolean, default: false },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    addresses: { type: [AddressSchema], default: [] }
  },
  { timestamps: true }
);

export type User = InferSchemaType<typeof UserSchema>;

export const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);
