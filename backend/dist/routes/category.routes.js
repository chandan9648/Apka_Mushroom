import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/requireAuth.js";
import { listCategories, createCategory, updateCategory, deleteCategory, UpsertCategorySchema } from "../controllers/category.controller.js";
import { validateBody } from "../middleware/validate.js";
export const categoryRouter = Router();
categoryRouter.get("/", listCategories);
categoryRouter.post("/", requireAuth, requireRole("admin"), validateBody(UpsertCategorySchema), createCategory);
categoryRouter.put("/:id", requireAuth, requireRole("admin"), updateCategory);
categoryRouter.delete("/:id", requireAuth, requireRole("admin"), deleteCategory);
