import { z } from "zod";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { CategoryModel } from "../models/Category.js";
import { ProductModel } from "../models/Product.js";
import { slugify } from "../utils/slugify.js";

export const UpsertProductSchema = z.object({
  name: z.string().min(2),
  categorySlug: z.string().min(1),
  price: z.number().positive(),
  compareAtPrice: z.number().positive().optional(),
  images: z.array(z.string()).optional(),
  description: z.string().optional(),
  benefits: z.array(z.string()).optional(),
  nutrition: z
    .object({
      calories: z.number().optional(),
      protein: z.number().optional(),
      carbs: z.number().optional(),
      fat: z.number().optional(),
      fiber: z.number().optional()
    })
    .optional(),
  tags: z.array(z.string()).optional(),
  stock: z.number().int().nonnegative().optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional()
});

export const listProducts = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page ?? 1));
  const limit = Math.min(48, Math.max(1, Number(req.query.limit ?? 12)));
  const skip = (page - 1) * limit;

  const category = typeof req.query.category === "string" ? req.query.category : undefined;
  const search = typeof req.query.search === "string" ? req.query.search : undefined;
  const minPrice = req.query.minPrice != null ? Number(req.query.minPrice) : undefined;
  const maxPrice = req.query.maxPrice != null ? Number(req.query.maxPrice) : undefined;
  const sort = typeof req.query.sort === "string" ? req.query.sort : "popularity";

  const filter: any = { isActive: true };

  if (category) {
    const cat = await CategoryModel.findOne({ slug: category });
    if (cat) filter.category = cat._id;
  }

  if (search) {
    filter.$or = [{ name: { $regex: search, $options: "i" } }, { tags: { $in: [new RegExp(search, "i")] } }];
  }

  if (minPrice != null || maxPrice != null) {
    filter.price = {};
    if (minPrice != null && !Number.isNaN(minPrice)) filter.price.$gte = minPrice;
    if (maxPrice != null && !Number.isNaN(maxPrice)) filter.price.$lte = maxPrice;
  }

  const sortMap: Record<string, any> = {
    priceAsc: { price: 1 },
    priceDesc: { price: -1 },
    popularity: { popularity: -1, ratingAvg: -1 }
  };

  const [items, total] = await Promise.all([
    ProductModel.find(filter).populate("category").sort(sortMap[sort] ?? sortMap.popularity).skip(skip).limit(limit),
    ProductModel.countDocuments(filter)
  ]);

  res.json({
    items,
    meta: { page, limit, total, pages: Math.ceil(total / limit) }
  });
});

export const featuredProducts = asyncHandler(async (req, res) => {
  const items = await ProductModel.find({ isFeatured: true, isActive: true }).sort({ popularity: -1 }).limit(8);
  res.json({ items });
});

export const getProductBySlug = asyncHandler(async (req, res) => {
  const slug = req.params.slug;
  const product = await ProductModel.findOne({ slug, isActive: true }).populate("category");
  if (!product) throw new ApiError(404, "Product not found");
  await ProductModel.updateOne({ _id: product._id }, { $inc: { popularity: 1 } });
  res.json({ product });
});

export const createProduct = asyncHandler(async (req, res) => {
  const body = UpsertProductSchema.parse(req.body);
  const category = await CategoryModel.findOne({ slug: body.categorySlug });
  if (!category) throw new ApiError(400, "Invalid category");

  const slug = slugify(body.name);
  const exists = await ProductModel.findOne({ slug });
  if (exists) throw new ApiError(409, "Product already exists");

  const product = await ProductModel.create({
    name: body.name,
    slug,
    category: category._id,
    price: body.price,
    compareAtPrice: body.compareAtPrice,
    images: body.images ?? [],
    description: body.description ?? "",
    benefits: body.benefits ?? [],
    nutrition: body.nutrition,
    tags: body.tags ?? [],
    stock: body.stock ?? 0,
    isFeatured: body.isFeatured ?? false,
    isActive: body.isActive ?? true
  });

  res.status(201).json({ product });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const body = UpsertProductSchema.partial().parse(req.body);

  const product = await ProductModel.findById(id);
  if (!product) throw new ApiError(404, "Product not found");

  if (body.name) {
    product.name = body.name;
    product.slug = slugify(body.name);
  }

  if (body.categorySlug) {
    const category = await CategoryModel.findOne({ slug: body.categorySlug });
    if (!category) throw new ApiError(400, "Invalid category");
    product.category = category._id;
  }

  if (body.price != null) product.price = body.price;
  if (body.compareAtPrice !== undefined) product.compareAtPrice = body.compareAtPrice;
  if (body.images !== undefined) product.images = body.images;
  if (body.description !== undefined) product.description = body.description;
  if (body.benefits !== undefined) product.benefits = body.benefits;
  if (body.nutrition !== undefined) product.nutrition = body.nutrition as any;
  if (body.tags !== undefined) product.tags = body.tags;

  const prevStock = product.stock;
  if (body.stock !== undefined) product.stock = body.stock;

  if (body.isFeatured !== undefined) product.isFeatured = body.isFeatured;
  if (body.isActive !== undefined) product.isActive = body.isActive;

  await product.save();

  if (body.stock !== undefined && body.stock !== prevStock) {
    const io = req.app.get("io");
    io.emit("stock:update", { productId: product._id.toString(), stock: product.stock });
  }

  res.json({ product });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const product = await ProductModel.findByIdAndDelete(id);
  if (!product) throw new ApiError(404, "Product not found");
  res.json({ ok: true });
});
