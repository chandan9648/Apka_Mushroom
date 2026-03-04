import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { BannerModel } from "../models/Banner.js";

/** Public: list active banners sorted by order */
export const listBanners = asyncHandler(async (_req, res) => {
  const items = await BannerModel.find({ isActive: true }).sort({ order: 1, createdAt: -1 }).lean();
  res.json({ items });
});

/** Admin: create a banner */
export const createBanner = asyncHandler(async (req, res) => {
  const { imageUrl, title } = req.body as { imageUrl?: string; title?: string };
  if (!imageUrl) throw new ApiError(400, "imageUrl is required");

  const count = await BannerModel.countDocuments();
  const banner = await BannerModel.create({ imageUrl, title: title ?? "", order: count });
  res.status(201).json(banner);
});

/** Admin: delete a banner */
export const deleteBanner = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const banner = await BannerModel.findByIdAndDelete(id);
  if (!banner) throw new ApiError(404, "Banner not found");
  res.json({ message: "Deleted" });
});
