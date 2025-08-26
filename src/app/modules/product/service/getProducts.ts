import { QueryBuilder } from "@app/classes";
import { ProductModel } from "../product.model";
import { ProductSearchableFields, ProductStatus } from "../product.constants";
import { normalizeStatusFilter } from "@utils/normalizeQueryParam";

export const getProducts = async (queryObj: Record<string, unknown>) => {
  const { status, ...newQueryObj } = normalizeStatusFilter(queryObj, {
    $ne: ProductStatus.Deleted,
  });

  const productQuery = new QueryBuilder(ProductModel, newQueryObj);

  // Populate topCategory and subCategory, keeping only slug
  productQuery
    .populate({
      from: "categories",
      localField: "topCategory",
      foreignField: "_id",
      as: "topCategory",
      unwind: true,
    })
    .addField("topCategory", "$topCategory.slug")
    .populate({
      from: "categories",
      localField: "subCategory",
      foreignField: "_id",
      as: "subCategory",
      unwind: true,
    })
    .addField("subCategory", "$subCategory.slug");

  productQuery
    .filter(["status"])
    .match({ status })
    .search([...ProductSearchableFields])
    .sort()
    .limitFields()
    .paginate();

  const products = await productQuery.exec();

  // Get query metadata
  const queryMeta = await productQuery.getQueryMeta();

  return { products, queryMeta };
};
