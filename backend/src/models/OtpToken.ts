import mongoose, { type InferSchemaType } from "mongoose";

const OtpTokenSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    purpose: { type: String, enum: ["verify_email", "reset_password"], required: true, index: true },
    codeHash: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: true }
  },
  { timestamps: true }
);

OtpTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export type OtpToken = InferSchemaType<typeof OtpTokenSchema>;

export const OtpTokenModel = mongoose.models.OtpToken || mongoose.model("OtpToken", OtpTokenSchema);
