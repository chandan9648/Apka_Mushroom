import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/requireAuth.js";
import {
  listProducts,
  featuredProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  UpsertProductSchema
} from "../controllers/product.controller.js";
import { validateBody } from "../middleware/validate.js";

export const productRouter = Router();

productRouter.get("/", listProducts);
productRouter.get("/featured", featuredProducts);
productRouter.get("/:slug", getProductBySlug);

productRouter.post("/", requireAuth, requireRole("admin"), validateBody(UpsertProductSchema), createProduct);
productRouter.put("/:id", requireAuth, requireRole("admin"), updateProduct);
productRouter.delete("/:id", requireAuth, requireRole("admin"), deleteProduct);
