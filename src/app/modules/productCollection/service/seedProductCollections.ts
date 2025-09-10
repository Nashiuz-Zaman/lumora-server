import { ICategory } from "@app/modules/category/category.type";
import { ProductCollectionModel } from "../productCollection.model";
import { CategoryModel } from "@app/modules/category/category.model";

export const seedProductCollections = async (): Promise<void> => {
  try {
    // Find all top-level categories as plain objects
    const topCategories = await CategoryModel.find({
      parentCategory: null,
    }).lean<ICategory[]>();

    if (!topCategories.length) {
      console.log("No top-level categories found to seed collections.");
      return;
    }

    for (const category of topCategories) {
      const title = category.title;
      const slug = category.slug;

      // Check if collection already exists
      const existingCollection = await ProductCollectionModel.findOne({ slug });

      if (existingCollection) {
        console.log(`Product collection already exists for category: ${title}`);
        continue;
      }

      // Create a new product collection
      await ProductCollectionModel.create({
        title,
        slug,
        products: [],
      });

      console.log(`Created product collection for: ${title}`);
    }

    console.log("✅ Product collections seeding completed.");
  } catch (error) {
    console.error("❌ Error seeding product collections:", error);
  }
};
