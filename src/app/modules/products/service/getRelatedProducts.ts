import { QueryBuilder } from "@app/classes/QueryBuilder";
import { ProductStatus } from "../product.constants";
import { ProductModel } from "../product.model";
import { IProduct } from "../product.type";

/**
 * Fetches up to 20 products that share tags with the input string.
 *
 * @param tags Comma-separated string of tags
 * @returns Promise resolving to an array of matching products
 */
export async function getRelatedProducts(
  tags: string | undefined
): Promise<IProduct[]> {
  if (!tags) return [];

  const tagsArray = tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  if (tagsArray.length === 0) return [];

  // Build $or with regex for each tag
  const tagMatchConditions = tagsArray.map((t) => ({
    tags: { $regex: new RegExp(`\\b${t}\\b`, "i") },
  }));

  const relatedProductsQuery = new QueryBuilder(ProductModel, {
    page: 1,
    limit: 20,
  });

  relatedProductsQuery
    .customMethod([
      {
        $match: {
          status: { $ne: ProductStatus.Deleted },
          $or: tagMatchConditions,
        },
      },
      { $sort: { createdAt: -1 } },
      { $limit: 20 },
    ])
    .removeField("variants")
    .removeField("images")
    .sort()
    .limitFields();

  const products = await relatedProductsQuery.exec();
  return products;
}
