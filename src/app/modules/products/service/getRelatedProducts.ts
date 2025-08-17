import { QueryBuilder } from "@app/classes/QueryBuilder";
import { ProductStatus } from "../product.constants";
import { ProductModel } from "../product.model";
import { IProduct } from "../product.type";

/**
 * Fetches up to 20 products that have at least one tag in the given tags array or comma-separated string.
 * Excludes deleted products.
 *
 * @param tags Array or comma-separated string of tags
 * @returns Promise resolving to an array of matching products
 */
export async function getRelatedProducts(
  tags: string[] | string | undefined | null
): Promise<IProduct[]> {
  if (!tags) return [];

  let tagsArray: string[] = [];

  if (Array.isArray(tags)) {
    tagsArray = tags
      .filter((t) => typeof t === "string" && t.trim().length > 0)
      .map((t) => t.trim());
  } else if (typeof tags === "string") {
    tagsArray = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }

  if (tagsArray.length === 0) return [];

  const relatedProductsQuery = new QueryBuilder(ProductModel, {
    page: 1,
    limit: 20,
  });

  relatedProductsQuery
    .customMethod([
      {
        $match: {
          tags: { $in: tagsArray },
          status: { $ne: ProductStatus.Deleted },
        },
      },
      { $sort: { createdAt: -1 } },
      { $limit: 20 },
      {
        $unionWith: {
          coll: "products",
          pipeline: [
            { $match: { status: { $ne: ProductStatus.Deleted } } },
            { $sort: { createdAt: -1 } },
            { $limit: 20 },
          ],
        },
      },
      {
        $group: {
          _id: "$_id",
          doc: { $first: "$$ROOT" }, // pick first doc per _id
        },
      },
      { $replaceRoot: { newRoot: "$doc" } }, // flatten grouped docs back
      { $limit: 20 },
    ])
    .pluckFromArray("variants", "defaultVariant", 0)
    .removeField("variants")
    .addField("defaultPrice", "defaultVariant.price")
    .addField("defaultOldPrice", "defaultVariant.oldPrice")
    .removeField("defaultVariant")
    .pluckFromArray("images", "defaultImage", 0)
    .removeField("images")
    .sort()
    .limitFields();

  const products = await relatedProductsQuery.exec();

  return products;
}
