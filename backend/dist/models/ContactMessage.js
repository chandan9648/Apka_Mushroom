import mongoose from "mongoose";
const ContactMessageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, index: true },
    message: { type: String, required: true },
    status: { type: String, enum: ["new", "read"], default: "new", index: true }
}, { timestamps: true });
export const ContactMessageModel = mongoose.models.ContactMessage || mongoose.model("ContactMessage", ContactMessageSchema);
