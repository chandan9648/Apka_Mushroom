import { z } from "zod";
import { asyncHandler } from "../utils/asyncHandler.js";
import { SubscriberModel } from "../models/Subscriber.js";
import { ContactMessageModel } from "../models/ContactMessage.js";
export const NewsletterSchema = z.object({
    email: z.string().email().transform((v) => v.toLowerCase())
});
export const ContactSchema = z.object({
    name: z.string().min(2),
    email: z.string().email().transform((v) => v.toLowerCase()),
    message: z.string().min(10)
});
export const subscribeNewsletter = asyncHandler(async (req, res) => {
    const body = NewsletterSchema.parse(req.body);
    await SubscriberModel.updateOne({ email: body.email }, { $set: { email: body.email } }, { upsert: true });
    res.status(201).json({ message: "Subscribed" });
});
export const sendContact = asyncHandler(async (req, res) => {
    const body = ContactSchema.parse(req.body);
    await ContactMessageModel.create(body);
    res.status(201).json({ message: "Message received" });
});
export const adminListContacts = asyncHandler(async (req, res) => {
    const items = await ContactMessageModel.find().sort({ createdAt: -1 }).limit(200);
    res.json({ items });
});
