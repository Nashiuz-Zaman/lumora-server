import {
  ProductStatus,
  stockLevels,
} from "@app/modules/product/product.constants";
import { ProductModel } from "@app/modules/product/product.model";

export const getLowTotalStockProducts = async () => {
  const result = await ProductModel.aggregate([
    {
      $match: {
        status: ProductStatus.Active,
        totalStock: { $lt: stockLevels.In_Stock },
      },
    },
    {
      $project: {
        _id: 0,
        title: 1,
        canonicalUrl: 1,
        totalStock: 1,
        variantCount: { $size: "$variants" },
      },
    },
    { $sort: { totalStock: 1 } },
    { $limit: 10 },
  ]);

  return result;
};
