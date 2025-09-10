import { QueryBuilder } from "@app/classes";
import { ProductCollectionModel } from "../productCollection.model";
import { IProductCollection } from "../productCollection.type";

export const getCollectionProducts = async (
  slug: string,
  query: Record<string, any>
) => {
  // Build the pipeline
  const collectionProductsQuery = new QueryBuilder<IProductCollection>(
    ProductCollectionModel,
    query
  );

  collectionProductsQuery
    .match({ slug }) // find collection by slug
    .populate({
      from: "products",
      localField: "products",
      foreignField: "_id",
      as: "products",
    })
    .unwind("products") // flatten products array
    .replaceRoot("products") // now we're working with Product docs only
    .filter(["slug"])
    .search(["title", "slug"]) // searchable fields of Product
    .sort()
    .limitFields()
    .paginate();

  // run meta + result in parallel
  const [queryMeta, products] = await Promise.all([
    collectionProductsQuery.getQueryMeta(),
    collectionProductsQuery.exec(),
  ]);

  return { queryMeta, products };
};
