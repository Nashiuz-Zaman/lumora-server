import { ProductStatus } from "../product.constants";
import { ICategoryTreeItem } from "@app/modules/category/category.type";
import { IProduct } from "../product.type";
import { getCategoryTree } from "@app/modules/category/service";
import { getProducts } from "./getProducts";

export type TMegaMenuItem = ICategoryTreeItem & {
  featuredProducts: Partial<IProduct>[];
};

export const getMegaMenuData = async (): Promise<TMegaMenuItem[]> => {
  const categoryTree = await getCategoryTree();

  const megaMenuData: TMegaMenuItem[] = [];

  for (const treeItem of categoryTree) {
    const queryObj = {
      topCategory: treeItem.topCategory.slug,
      limit: 6,
      sort: "-createdAt",
      status: ProductStatus.Active,
    };

    const { products } = await getProducts(queryObj);

    megaMenuData.push({
      ...treeItem,
      featuredProducts: products,
    });
  }

  return megaMenuData;
};
