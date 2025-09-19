import { ICategory } from "@app/modules/category/category.type";
import { BackupProductCollectionModel } from "../backupProductCollection.model";
import { CategoryModel } from "@app/modules/category/category.model";

export const seedBackupProductCollections = async (): Promise<void> => {
  try {
    const existingCollection = await BackupProductCollectionModel.findOne({
      slug: "top-selling-products-homepage",
    });

    if (existingCollection) {
      console.log(
        `Product collection already exists for category: ${existingCollection.title}`
      );
    } else {
      // Create a new product collection
      const topSellingCollection = await BackupProductCollectionModel.create({
        title: "Top Selling Products",
        slug: "top-selling-products",
        page: "homepage",
      });

      if (topSellingCollection._id)
        console.log(
          `Created product collection for: ${topSellingCollection.title}`
        );
    }

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
      const slug = `${category.slug}-homepage`;

      // Check if collection already exists
      const existingCollection = await BackupProductCollectionModel.findOne({
        slug,
      });

      if (existingCollection) {
        console.log(`Product collection already exists for category: ${title}`);
        continue;
      }

      // Create a new product collection
      await BackupProductCollectionModel.create({
        title,
        slug,
      });

      console.log(`Created product collection for: ${title}`);
    }

    console.log("✅ Product collections seeding completed.");
  } catch (error) {
    console.error("❌ Error seeding product collections:", error);
  }
};
