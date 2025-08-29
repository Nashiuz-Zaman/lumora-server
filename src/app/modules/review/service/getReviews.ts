import { ReviewModel } from "../review.model";
import { QueryBuilder } from "@app/classes/QueryBuilder";
import { IReview } from "../review.type";
import { ReviewSearchableFields, ReviewStatus } from "../review.constants";
import { normalizeStatusFilter } from "@utils/normalizeQueryParam";

export const getReviews = async (queryObj: Record<string, any>) => {
  const newQueryObj = normalizeStatusFilter(queryObj, {
    ne: ReviewStatus.Deleted,
  });

  const query = new QueryBuilder<IReview>(ReviewModel, newQueryObj);

  const reviews = await query
    .filter()
    .populate({
      localField: "product",
      foreignField: "_id",
      from: "products",
      as: "product",
      unwind: true,
    })
    .addField("productName", "product.title")
    .removeField("product")
    .search([...ReviewSearchableFields])
    .sort()
    .limitFields()
    .paginate()
    .exec();

  const queryMeta = await query.getQueryMeta();

  return { reviews, queryMeta };
};
