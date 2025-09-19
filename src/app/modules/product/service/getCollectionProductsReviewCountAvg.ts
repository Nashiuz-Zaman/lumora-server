import { getReviewCountAndAverage } from "@app/modules/review/service";
import { getCollectionProducts } from "./getCollectionProducts";
import { Types } from "mongoose";
import { TPopulatedProductInCollectionWithReviewStats } from "@app/modules/productCollection/productCollection.type";

export const getCollectionProductsReviewCountAvg = async (
  queryObj: Record<string, any>
) => {
  // get collection products
  const { products, queryMeta } = await getCollectionProducts(queryObj);

  if (!Array.isArray(products) || products.length === 0) {
    return { products: [], queryMeta };
  }

  // extract product IDs
  const productIds = products.map((p) => p?.product?._id as Types.ObjectId);

  // fetch review stats
  const reviewStats = await getReviewCountAndAverage(productIds);

  // Step 4: map stats back to products
  const productsWithStats = products.map((p) => {
    const stat = reviewStats.find((r) => r.productId.equals(p.product._id));

    return {
      ...p,
      reviewStats: {
        averageRating: stat?.averageRating ?? 0,
        totalReviews: stat?.totalReviews ?? 0,
      },
    };
  });

  return {
    products:
      productsWithStats as TPopulatedProductInCollectionWithReviewStats[],
    queryMeta,
  };
};
