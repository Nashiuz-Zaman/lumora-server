import { QueryBuilder } from "@app/classes";
import { ProductCollectionModel } from "../productCollection.model";
import { IProductCollection } from "../productCollection.type";

export const getAllProductCollections = async () => {
  const productCollectionsQuery = new QueryBuilder<IProductCollection>(
    ProductCollectionModel,
    { limitFields: "slug,title" }
  );

  productCollectionsQuery.customMethod([
    // Step 1: project only needed fields and also compute product count
    {
      $project: {
        slug: 1,
        title: 1,
        page: 1,
        productCount: { $size: { $ifNull: ["$products", []] } },
      },
    },
    // Step 2: group by page
    {
      $group: {
        _id: "$page",
        productCollections: {
          $push: {
            _id: "$_id",
            slug: "$slug",
            title: "$title",
            productCount: "$productCount",
          },
        },
      },
    },
  ]);

  return await productCollectionsQuery.exec();
};
