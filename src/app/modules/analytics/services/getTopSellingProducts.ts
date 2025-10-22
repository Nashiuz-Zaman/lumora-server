import { OrderStatus } from "@app/modules/order/order.constants";
import { extractDateRangeFilterFromQuery } from "../helpers";
import { OrderModel } from "@app/modules/order/order.model";

export const getTopSellingProducts = async (
  queryObj: Record<string, any> = {}
) => {
  const dateRange = extractDateRangeFilterFromQuery(queryObj);

  // include all orders except pending or cancelled
  const matchStage: Record<string, any> = {
    status: { $nin: [OrderStatus.Pending, OrderStatus.Cancelled] },
  };

  if (dateRange?.current) {
    matchStage.createdAt = dateRange.current;
  }

  const result = await OrderModel.aggregate([
    { $match: matchStage },
    { $unwind: "$items" },
    {
      $group: {
        _id: {
          productId: "$items.product._id",
          variantId: "$items.variant._id",
        },
        totalSold: { $sum: "$items.quantity" },
        title: { $first: "$items.product.title" },
        slug: { $first: "$items.product.slug" },
        brand: { $first: "$items.product.brand" },
      },
    },
    { $sort: { totalSold: -1 } },
    { $limit: 10 },
    {
      $project: {
        _id: 0,
        productId: "$_id.productId",
        variantId: "$_id.variantId",
        title: "$_id.title",
        slug: "$_id.slug",
        brand: "$_id.brand",
        totalSold: 1,
      },
    },
  ]);

  return result;
};
