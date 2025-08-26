import { CategoryModel } from "../category.model";
import { subCategoriesMap, topCategories } from "../data/categoryData";

export async function seedCategories() {
  try {
    // Create top-level categories if they don't exist
    for (const topCategory of topCategories) {
      let topCat = await CategoryModel.findOne({ slug: topCategory.slug });
      if (!topCat) {
        topCat = await CategoryModel.create(topCategory);
      } else {
        console.log(`${topCategory.title} already exists`);
      }

      // Create subcategories
      const subCats = subCategoriesMap[topCategory.title];
      for (const subCategory of subCats) {
        const exists = await CategoryModel.findOne({ slug: subCategory.slug });
        if (!exists) {
          await CategoryModel.create({
            ...subCategory,
            parentCategory: topCat._id,
          });
        } else {
          console.log(`${subCategory.title} already exists`);
        }
      }
    }

    console.log("Categories seeded successfully!");
  } catch (err) {
    console.error("Error seeding categories:", err);
  }
}
