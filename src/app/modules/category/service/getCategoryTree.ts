import { CategoryModel } from "../category.model";

export async function getCategoryTree() {
  const categories = await CategoryModel.find().lean();

  // Get top categories
  const topCategories = categories.filter((c) => !c.parentCategory);

  // Map top categories to their subcategories
  const categoryTree = topCategories.map((topCat) => ({
    topCategory: {
      _id: topCat._id,
      title: topCat.title,
      slug: topCat.slug,
    },
    subCategories: categories
      .filter((c) => String(c.parentCategory) === String(topCat._id))
      .map((sub) => ({
        _id: sub._id,
        title: sub.title,
        slug: sub.slug,
      })),
  }));

  return categoryTree;
}
