import mongoose, { type InferSchemaType } from "mongoose";

const BannerSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true },
    title: { type: String, default: "" },
    isActive: { type: Boolean, default: true, index: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type IBanner = InferSchemaType<typeof BannerSchema> & { _id: mongoose.Types.ObjectId };
export const BannerModel = mongoose.model("Banner", BannerSchema);
