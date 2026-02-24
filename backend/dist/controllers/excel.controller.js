import xlsx from "xlsx";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { CategoryModel } from "../models/Category.js";
import { ProductModel } from "../models/Product.js";
import { slugify } from "../utils/slugify.js";
export const uploadProductsExcel = asyncHandler(async (req, res) => {
    const file = req.file;
    if (!file)
        throw new ApiError(400, "No file uploaded");
    const workbook = xlsx.readFile(file.path);
    const sheetName = workbook.SheetNames[0];
    if (!sheetName)
        throw new ApiError(400, "No sheets found");
    const sheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(sheet, { defval: "" });
    let created = 0;
    let skipped = 0;
    for (const row of rows) {
        const name = String(row.name || row.Name || "").trim();
        const categorySlug = String(row.categorySlug || row.Category || row.category || "").trim();
        const price = Number(row.price || row.Price || 0);
        if (!name || !categorySlug || !Number.isFinite(price) || price <= 0) {
            skipped++;
            continue;
        }
        const normalizedCategorySlug = slugify(categorySlug);
        const category = await CategoryModel.findOne({ slug: normalizedCategorySlug });
        if (!category) {
            // auto-create category for convenience
            await CategoryModel.create({ name: categorySlug, slug: normalizedCategorySlug });
        }
        const cat = await CategoryModel.findOne({ slug: normalizedCategorySlug });
        if (!cat) {
            skipped++;
            continue;
        }
        const slug = slugify(name);
        const exists = await ProductModel.findOne({ slug });
        if (exists) {
            skipped++;
            continue;
        }
        const tagsRaw = String(row.tags || row.Tags || "");
        const tags = tagsRaw
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);
        const imagesRaw = String(row.images || row.Images || "");
        const images = imagesRaw
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);
        const stock = Number(row.stock || row.Stock || 0);
        await ProductModel.create({
            name,
            slug,
            category: cat._id,
            price,
            stock: Number.isFinite(stock) && stock >= 0 ? Math.round(stock) : 0,
            description: String(row.description || row.Description || ""),
            tags,
            images,
            isFeatured: String(row.isFeatured || row.Featured || "").toLowerCase() === "true",
            isActive: String(row.isActive || row.Active || "").toLowerCase() !== "false"
        });
        created++;
    }
    res.status(201).json({ created, skipped });
});
