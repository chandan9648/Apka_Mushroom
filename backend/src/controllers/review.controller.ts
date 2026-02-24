import { z } from "zod";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ReviewModel } from "../models/Review.js";
import { ProductModel } from "../models/Product.js";

export const CreateReviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  title: z.string().optional(),
  comment: z.string().optional()
});

export const listReviews = asyncHandler(async (req, res) => {
  const productId = typeof req.query.productId === "string" ? req.query.productId : undefined;
  const filter: any = {};
  if (productId) filter.product = productId;

  const items = await ReviewModel.find(filter).populate("user", "name").sort({ createdAt: -1 }).limit(50);
  res.json({ items });
});

export const createOrUpdateReview = asyncHandler(async (req, res) => {
  if (!req.auth) throw new ApiError(401, "Unauthorized");
  const body = CreateReviewSchema.parse(req.body);

  const product = await ProductModel.findById(body.productId);
  if (!product) throw new ApiError(404, "Product not found");

  const review = await ReviewModel.findOneAndUpdate(
    { user: req.auth.sub, product: body.productId },
    {
      $set: {
        rating: body.rating,
        title: body.title ?? "",
        comment: body.comment ?? ""
      }
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const agg = await ReviewModel.aggregate([
    { $match: { product: product._id } },
    { $group: { _id: "$product", avg: { $avg: "$rating" }, count: { $sum: 1 } } }
  ]);

  const stats = agg[0];
  await ProductModel.updateOne(
    { _id: product._id },
    { $set: { ratingAvg: stats?.avg ?? 0, ratingCount: stats?.count ?? 0 } }
  );

  res.status(201).json({ review });
});
