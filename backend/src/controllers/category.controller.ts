import { z } from "zod";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { CategoryModel } from "../models/Category.js";
import { slugify } from "../utils/slugify.js";

export const UpsertCategorySchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  imageUrl: z.string().url().optional()
});

export const listCategories = asyncHandler(async (req, res) => {
  const items = await CategoryModel.find().sort({ name: 1 });
  res.json({ items });
});

export const createCategory = asyncHandler(async (req, res) => {
  const body = UpsertCategorySchema.parse(req.body);
  const slug = slugify(body.name);

  const exists = await CategoryModel.findOne({ slug });
  if (exists) throw new ApiError(409, "Category already exists");

  const category = await CategoryModel.create({ ...body, slug });
  res.status(201).json({ category });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const body = UpsertCategorySchema.partial().parse(req.body);

  const category = await CategoryModel.findById(id);
  if (!category) throw new ApiError(404, "Category not found");

  if (body.name) {
    category.name = body.name;
    category.slug = slugify(body.name);
  }
  if (body.description !== undefined) category.description = body.description;
  if (body.imageUrl !== undefined) category.imageUrl = body.imageUrl;

  await category.save();
  res.json({ category });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const category = await CategoryModel.findByIdAndDelete(id);
  if (!category) throw new ApiError(404, "Category not found");
  res.json({ ok: true });
});
