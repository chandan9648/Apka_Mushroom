import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { listReviews, createOrUpdateReview, CreateReviewSchema } from "../controllers/review.controller.js";
import { validateBody } from "../middleware/validate.js";
export const reviewRouter = Router();
reviewRouter.get("/", listReviews);
reviewRouter.post("/", requireAuth, validateBody(CreateReviewSchema), createOrUpdateReview);
