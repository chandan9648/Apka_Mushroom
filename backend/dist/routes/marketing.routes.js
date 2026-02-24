import { Router } from "express";
import { validateBody } from "../middleware/validate.js";
import { subscribeNewsletter, NewsletterSchema, sendContact, ContactSchema, adminListContacts } from "../controllers/marketing.controller.js";
import { requireAuth, requireRole } from "../middleware/requireAuth.js";
export const marketingRouter = Router();
marketingRouter.post("/newsletter", validateBody(NewsletterSchema), subscribeNewsletter);
marketingRouter.post("/contact", validateBody(ContactSchema), sendContact);
marketingRouter.get("/admin/contacts", requireAuth, requireRole("admin"), adminListContacts);
