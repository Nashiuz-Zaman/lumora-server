import { ProductCollectionModel } from "@app/modules/productCollection/productCollection.model";
import { QueryBuilder } from "@app/classes";
import {
  IProductCollection,
  TPopulatedProductInCollection,
} from "@app/modules/productCollection/productCollection.type";
import { ProductSearchableFieldsForSingleProductCollectionQuery } from "../product.constants";

export const getCollectionProducts = async (queryObj: Record<string, any>) => {
  const { slug, limitFields, ...restOther } = queryObj;

  // Process limitFields
  let processedLimitFields;
  if (limitFields) {
    processedLimitFields = limitFields
      .split(",")
      .map((field: string) =>
        field.trim() === "serial" ? "serial" : `product.${field.trim()}`
      )
      .join(",");
  }

  // Merge back the processed limitFields into rest
  const rest = {
    ...restOther,
    ...(processedLimitFields ? { limitFields: processedLimitFields } : {}),
  };

  const productsQuery = new QueryBuilder<IProductCollection>(
    ProductCollectionModel,
    rest
  );

  productsQuery
    .match({ slug: slug })
    .unwind("products")
    .replaceRoot("products")
    .sort()
    .populate({
      from: "products",
      localField: "product",
      foreignField: "_id",
      as: "product",
      unwind: true,
    })
    .search([...ProductSearchableFieldsForSingleProductCollectionQuery])
    .addField("product.defaultOldPrice", {
      $ifNull: [{ $arrayElemAt: ["$product.variants.oldPrice", 0] }, null],
    })
    .addField("product.totalVariants", { $size: "$product.variants" })
    .limitFields()
    .paginate();

  const [products, queryMeta] = await Promise.all([
    productsQuery.exec(),
    productsQuery.getQueryMeta(),
  ]);

  return {
    products: products as unknown as TPopulatedProductInCollection[],
    queryMeta,
  };
};
