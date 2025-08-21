import { CategoryModel } from "../category.model";
import { subCategoriesMap, topCategories } from "../data/categoryData";

export async function seedCategories() {
  try {
    // Create top-level categories if they don't exist
    for (const cat of topCategories) {
      let topCat = await CategoryModel.findOne({ slug: cat.slug });
      if (!topCat) {
        topCat = await CategoryModel.create(cat);
      } else {
        console.log(`${cat.title} already exists`);
      }

      // Create subcategories
      const subCats = subCategoriesMap[cat.title];
      for (const sub of subCats) {
        const exists = await CategoryModel.findOne({ slug: sub.slug });
        if (!exists) {
          await CategoryModel.create({
            ...sub,
            parentCategory: topCat._id,
          });
        } else {
          console.log(`${sub.title} already exists`);
        }
      }
    }

    console.log("Categories seeded successfully!");
  } catch (err) {
    console.error("Error seeding categories:", err);
  }
}
