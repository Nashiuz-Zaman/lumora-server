import { CategoryModel } from "../category.model";
import { ICategoryTreeItem } from "../category.type";

export const getCategoryTree = async (): Promise<ICategoryTreeItem[]> => {
  // Fetch and sort by createdAt (ascending = oldest first)
  const categories = await CategoryModel.find().sort({ createdAt: 1 }).lean();

  // Get top categories
  const topCategories = categories.filter((cat) => !cat.parentCategory);

  // Map top categories to their subcategories
  const categoryTree = topCategories.map((topCat) => ({
    topCategory: topCat,
    subCategories: categories.filter(
      (c) => String(c.parentCategory) === String(topCat._id)
    ),
  }));

  return categoryTree;
};
