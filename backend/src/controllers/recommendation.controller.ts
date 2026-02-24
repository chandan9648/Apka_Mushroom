import { asyncHandler } from "../utils/asyncHandler.js";
import { ProductModel } from "../models/Product.js";

export const getRecommendations = asyncHandler(async (req, res) => {
  const productId = typeof req.query.productId === "string" ? req.query.productId : undefined;
  const category = typeof req.query.category === "string" ? req.query.category : undefined;

  if (productId) {
    const base = await ProductModel.findById(productId);
    if (!base) return res.json({ items: [] });

    const items = await ProductModel.find({
      _id: { $ne: base._id },
      isActive: true,
      $or: [{ category: base.category }, { tags: { $in: base.tags.slice(0, 5) } }]
    })
      .sort({ popularity: -1, ratingAvg: -1 })
      .limit(8);

    return res.json({ items });
  }

  if (category) {
    const items = await ProductModel.find({ isActive: true }).sort({ popularity: -1 }).limit(8);
    return res.json({ items });
  }

  const items = await ProductModel.find({ isActive: true }).sort({ popularity: -1 }).limit(8);
  res.json({ items });
});
