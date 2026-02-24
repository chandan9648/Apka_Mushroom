export type Category = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
};

export type Product = {
  _id: string;
  name: string;
  slug: string;
  category: Category | string;
  price: number;
  compareAtPrice?: number;
  currency?: string;
  images: string[];
  description?: string;
  benefits?: string[];
  nutrition?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
  };
  tags?: string[];
  stock: number;
  isFeatured?: boolean;
  ratingAvg?: number;
  ratingCount?: number;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  isEmailVerified: boolean;
};

export type OrderItem = {
  product: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

export type Order = {
  _id: string;
  status: "pending_payment" | "paid" | "packed" | "shipped" | "delivered" | "cancelled";
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  createdAt: string;
  razorpayOrderId?: string;
};
