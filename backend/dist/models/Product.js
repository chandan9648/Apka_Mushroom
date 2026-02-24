import mongoose from "mongoose";
const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true, index: true },
    price: { type: Number, required: true },
    compareAtPrice: { type: Number },
    currency: { type: String, default: "INR" },
    images: { type: [String], default: [] },
    description: { type: String, default: "" },
    benefits: { type: [String], default: [] },
    nutrition: {
        calories: { type: Number },
        protein: { type: Number },
        carbs: { type: Number },
        fat: { type: Number },
        fiber: { type: Number }
    },
    tags: { type: [String], default: [] },
    stock: { type: Number, default: 0, index: true },
    isFeatured: { type: Boolean, default: false, index: true },
    isActive: { type: Boolean, default: true, index: true },
    ratingAvg: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    popularity: { type: Number, default: 0, index: true }
}, { timestamps: true });
export const ProductModel = mongoose.models.Product || mongoose.model("Product", ProductSchema);
