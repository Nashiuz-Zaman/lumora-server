import { ProductModel } from "../product.model";
import { TProductDoc } from "../product.type";
import { ProductSearchableFields, ProductStatus } from "../product.constants";
import { IQueryMeta, QueryBuilder } from "../../../classes/QueryBuilder";
import { normalizeStatusFilter } from "@utils/normalizeQueryParam";

export const getProducts = async (
  queryObj: Record<string, any>
): Promise<{ products: Partial<TProductDoc>[]; queryMeta: IQueryMeta }> => {
  const { status, ...newQueryObj } = normalizeStatusFilter(queryObj, {
    $ne: ProductStatus.Deleted,
  });

  const productQuery = new QueryBuilder(ProductModel, newQueryObj);

  const result = await productQuery
    .filter(["status"])
    .match("status", status)
    .pluckFromArray("variants", "defaultVariant", 0)
    .addField("defaultPrice", "defaultVariant.price")
    .pluckFromArray("images", "defaultImage", 0)
    .countArrayLength("variants", "totalVariants")
    .search([...ProductSearchableFields])
    .sort()
    .limitFields()
    .paginate()
    .exec();

  const queryMeta = await productQuery.getQueryMeta();

  return { products: result, queryMeta };
};
