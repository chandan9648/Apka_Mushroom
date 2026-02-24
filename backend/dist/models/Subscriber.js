import mongoose from "mongoose";
const SubscriberSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, index: true },
    source: { type: String, default: "website" }
}, { timestamps: true });
export const SubscriberModel = mongoose.models.Subscriber || mongoose.model("Subscriber", SubscriberSchema);
