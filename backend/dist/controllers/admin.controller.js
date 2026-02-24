import { asyncHandler } from "../utils/asyncHandler.js";
import { UserModel } from "../models/User.js";
import { ProductModel } from "../models/Product.js";
import { OrderModel } from "../models/Order.js";
export const listUsers = asyncHandler(async (req, res) => {
    const items = await UserModel.find().select("name email role isEmailVerified createdAt").sort({ createdAt: -1 }).limit(200);
    res.json({ items });
});
export const stats = asyncHandler(async (req, res) => {
    const [users, products, orders] = await Promise.all([
        UserModel.countDocuments(),
        ProductModel.countDocuments(),
        OrderModel.countDocuments()
    ]);
    res.json({ users, products, orders });
});
export const analytics = asyncHandler(async (req, res) => {
    const last30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const salesByDay = await OrderModel.aggregate([
        { $match: { status: { $in: ["paid", "packed", "shipped", "delivered"] }, createdAt: { $gte: last30 } } },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                revenue: { $sum: "$total" },
                orders: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);
    const topProducts = await OrderModel.aggregate([
        { $match: { status: { $in: ["paid", "packed", "shipped", "delivered"] } } },
        { $unwind: "$items" },
        {
            $group: {
                _id: "$items.product",
                qty: { $sum: "$items.quantity" },
                revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
            }
        },
        { $sort: { revenue: -1 } },
        { $limit: 8 },
        {
            $lookup: {
                from: "products",
                localField: "_id",
                foreignField: "_id",
                as: "product"
            }
        },
        { $unwind: "$product" },
        { $project: { _id: 0, productId: "$product._id", name: "$product.name", revenue: 1, qty: 1 } }
    ]);
    res.json({ salesByDay, topProducts });
});
