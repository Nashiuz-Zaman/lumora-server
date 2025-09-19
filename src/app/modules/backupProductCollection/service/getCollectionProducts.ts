import { QueryBuilder } from "@app/classes";
import { BackupProductCollectionModel } from "../backupProductCollection.model";
import { IBackupProductCollection } from "../backupProductCollection.type";

export const getCollectionProducts = async (
  slug: string,
  query: Record<string, any>
) => {
  // Build the pipeline
  const collectionProductsQuery = new QueryBuilder<IBackupProductCollection>(
    BackupProductCollectionModel,
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
    .replaceRoot("products") 
    .filter(["slug"])
    .search(["title", "slug"]) 
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
