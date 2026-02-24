import { Router } from "express";
import { getRecommendations } from "../controllers/recommendation.controller.js";

export const recommendationRouter = Router();

recommendationRouter.get("/", getRecommendations);
