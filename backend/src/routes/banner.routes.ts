import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/requireAuth.js";
import { listBanners, createBanner, deleteBanner } from "../controllers/banner.controller.js";

export const bannerRouter = Router();

// Public
bannerRouter.get("/", listBanners);

// Admin only
bannerRouter.post("/", requireAuth, requireRole("admin"), createBanner);
bannerRouter.delete("/:id", requireAuth, requireRole("admin"), deleteBanner);
