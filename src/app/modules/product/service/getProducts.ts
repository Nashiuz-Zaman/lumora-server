import { QueryBuilder } from "@app/classes";
import { ProductModel } from "../product.model";
import { ProductSearchableFields, ProductStatus } from "../product.constants";
import { normalizeStatusFilter } from "@utils/normalizeQueryParam";
import { buildInQuery } from "@utils/index";
import { ReviewModel } from "../../review/review.model";
import { ReviewStatus } from "../../review/review.constants";
import { IProduct } from "../product.type";

export const getProducts = async (queryObj: Record<string, unknown>) => {
  // --- Prep query object ---
  let newQueryObj = normalizeStatusFilter(queryObj, {
    ne: ProductStatus.Deleted,
  });

  // --- format the min and max price ---
  const { priceMin, priceMax } = newQueryObj;

  const priceFilter: Record<string, unknown> = {};
  if (priceMin !== undefined && priceMin !== null)
    priceFilter.gte = Number(priceMin);
  if (priceMax !== undefined && priceMax !== null)
    priceFilter.lte = Number(priceMax);

  delete newQueryObj.priceMin;
  delete newQueryObj.priceMax;

  if (Object.keys(priceFilter).length > 0) {
    newQueryObj.defaultPrice = priceFilter;
  }

  // --- format the sub category and brands filter ---
  const subCategoryFilter = buildInQuery(newQueryObj.subCategory as any);
  const brandFilter = buildInQuery(newQueryObj.brand as any);

  if (queryObj.subCategory) {
    newQueryObj["subCategory.slug"] = subCategoryFilter;
    delete newQueryObj.subCategory;
  }

  if (queryObj.brand) {
    newQueryObj.brand = brandFilter;
  } else {
    delete queryObj.brand;
  }

  newQueryObj = JSON.parse(JSON.stringify(newQueryObj).replace(/\$in/gi, "in"));

  console.log(newQueryObj);

  // === PRODUCT QUERY ===
  const productQuery = new QueryBuilder(ProductModel, newQueryObj);

  const { brand, ...rest } = newQueryObj;

  const brandQuery = new QueryBuilder(ProductModel, rest);

  productQuery
    .populate({
      from: "categories",
      localField: "topCategory",
      foreignField: "_id",
      as: "topCategory",
      unwind: true,
    })
    .populate({
      from: "categories",
      localField: "subCategory",
      foreignField: "_id",
      as: "subCategory",
      unwind: true,
    })
    .addField("defaultOldPrice", {
      $ifNull: [{ $arrayElemAt: ["$variants.oldPrice", 0] }, null],
    })
    .filter()
    .search([...ProductSearchableFields])
    .addField("totalVariants", { $size: "$variants" })
    .sort()
    .limitFields()
    .paginate();

  // Execute product query
  const products = await productQuery.exec();
  const queryMeta = await productQuery.getQueryMeta();

  // REVIEW STATS QUERY (only for paginated products)
  const productIds = products.map((p: any) => p._id);

  const reviewStats = await ReviewModel.aggregate([
    {
      $match: {
        product: { $in: productIds },
        status: ReviewStatus.Approved,
      },
    },
    {
      $group: {
        _id: "$product",
        averageRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
    {
      $project: {
        averageRating: { $round: ["$averageRating", 1] },
        totalReviews: 1,
      },
    },
  ]);

  const statsMap = reviewStats?.reduce((acc, stat) => {
    acc[stat._id.toString()] = {
      averageRating: Math.round((stat.averageRating ?? 0) * 10) / 10,
      totalReviews: stat.totalReviews,
    };
    return acc;
  }, {} as Record<string, { averageRating: number; totalReviews: number }>);

  // Merge stats back into products
  const productsWithMinimalReviewStats =
    products.length === 0
      ? []
      : products.map((p: IProduct) => ({
          ...p,
          averageRating: (statsMap[p._id!.toString()]?.averageRating ||
            0) as number,
          totalReviews: (statsMap[p._id!.toString()]?.totalReviews ||
            0) as number,
        }));

  // === BRAND QUERY ===
  brandQuery
    .populate({
      from: "categories",
      localField: "topCategory",
      foreignField: "_id",
      as: "topCategory",
      unwind: true,
    })

    .populate({
      from: "categories",
      localField: "subCategory",
      foreignField: "_id",
      as: "subCategory",
      unwind: true,
    })

    .filter()
    .search([...ProductSearchableFields])
    .customMethod([
      { $group: { _id: "$brand" } },
      { $project: { _id: 0, brand: "$_id" } },
      { $match: { brand: { $nin: [null, ""] } } },
    ]);

  const brandsResult = await brandQuery.exec();
  const brands = brandsResult.map((b) => b.brand);

  return { products: productsWithMinimalReviewStats, queryMeta, brands };
};
