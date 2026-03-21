// import dotenv from "dotenv";
// import { connectDb } from "../db/connect.js";
// import { CategoryModel } from "../models/Category.js";
// import { ProductModel } from "../models/Product.js";
// import { slugify } from "../utils/slugify.js";

// dotenv.config();

// async function seedProducts() {
//   try {
//     await connectDb();
//     console.log("✓ Connected to database");

//     // Clear existing products
//     await ProductModel.deleteMany({});
//     console.log("✓ Cleared existing products");

//     // Get or create categories
//     const categories = await CategoryModel.find({});
//     let mushroom = categories.find((c) => c.slug === "mushroom");

//     if (!mushroom) {
//       mushroom = await CategoryModel.create({
//         name: "Mushroom",
//         slug: "mushroom",
//         description: "Premium quality mushrooms"
//       });
//       console.log("✓ Created Mushroom category");
//     }

//     // Create test products
//     const products = [
//       {
//         name: "Organic Shiitake Mushroom",
//         category: mushroom._id,
//         price: 299,
//         compareAtPrice: 399,
//         weight: 250,
//         weightUnit: "g",
//         images: [
//           "https://images.unsplash.com/photo-1585521537806-e42af2d27514?w=400"
//         ],
//         description: "Fresh organic shiitake mushrooms rich in nutrients",
//         benefits: ["High in vitamin D", "Immune support", "Antioxidants"],
//         tags: ["organic", "fresh", "premium"],
//         stock: 100,
//         isFeatured: true,
//         isActive: true
//       },
//       {
//         name: "Oyster Mushroom Mix",
//         category: mushroom._id,
//         price: 199,
//         weight: 500,
//         weightUnit: "g",
//         images: [
//           "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400"
//         ],
//         description: "Delicious mix of oyster mushrooms",
//         benefits: ["Rich in protein", "Low calorie", "Versatile"],
//         tags: ["mushroom", "cooking"],
//         stock: 150,
//         isFeatured: true,
//         isActive: true
//       },
//       {
//         name: "Portobello Mushroom",
//         category: mushroom._id,
//         price: 149,
//         weight: 300,
//         weightUnit: "g",
//         images: [
//           "https://images.unsplash.com/photo-1552844221-3b25b5c21ae4?w=400"
//         ],
//         description: "Large, meaty portobello mushrooms",
//         benefits: ["Good source of B vitamins", "Umami flavor"],
//         tags: ["mushroom", "cooking", "fresh"],
//         stock: 120,
//         isActive: true
//       }
//     ];

//     const createdProducts = await Promise.all(
//       products.map((p) =>
//         ProductModel.create({
//           ...p,
//           slug: slugify(p.name)
//         })
//       )
//     );

//     console.log(
//       `✓ Created ${createdProducts.length} products with slugs:`
//     );
//     createdProducts.forEach((p) => {
//       console.log(`  - ${p.name} (${p.slug})`);
//     });

//     console.log("\n✓ Database seeding completed successfully!");
//     process.exit(0);
//   } catch (error) {
//     console.error("✗ Seeding error:", error);
//     process.exit(1);
//   }
// }

// seedProducts();
