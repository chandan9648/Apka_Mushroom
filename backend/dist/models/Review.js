import mongoose from "mongoose";
const ReviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, default: "" },
    comment: { type: String, default: "" }
}, { timestamps: true });
ReviewSchema.index({ user: 1, product: 1 }, { unique: true });
export const ReviewModel = mongoose.models.Review || mongoose.model("Review", ReviewSchema);
