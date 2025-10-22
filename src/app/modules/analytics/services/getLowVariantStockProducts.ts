import {
  ProductStatus,
  stockLevels,
} from "@app/modules/product/product.constants";
import { ProductModel } from "@app/modules/product/product.model";

export const getLowVariantStockProducts = async () => {
  const pipeline: any[] = [
    {
      $match: {
        status: ProductStatus.Active,
      },
    },
    {
      $addFields: {
        lowStockVariants: {
          $filter: {
            input: "$variants",
            as: "variant",
            cond: { $lt: ["$$variant.stock", stockLevels.In_Stock] },
          },
        },
      },
    },
    {
      $match: {
        "lowStockVariants.0": { $exists: true },
      },
    },
    {
      $addFields: {
        minVariantStock: {
          $min: "$lowStockVariants.stock",
        },
      },
    },
    {
      $sort: {
        minVariantStock: 1,
      },
    },
    {
      $project: {
        title: 1,
        totalStock: 1,
        minVariantStock: 1,
        canonicalUrl: 1,
      },
    },
    { $limit: 10 },
  ];

  const products = await ProductModel.aggregate(pipeline);
  return products;
};
