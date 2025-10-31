import { OrderModel } from "@app/modules/order/order.model";
import {
  extractDateRangeFilterFromQuery,
  getGranularityFromDateRange,
  padMissingDates,
  getMongoDateFormat, 
} from "../helpers";

export const getOrderTrendsData = async (
  queryObj: Record<string, any>
): Promise<{ date: string; totalOrders: number }[]> => {
  const dateRange = extractDateRangeFilterFromQuery(queryObj);
  const granularity = getGranularityFromDateRange(dateRange);
  const mongoDateFormat = getMongoDateFormat(granularity);

  const match: Record<string, any> = {};
  let start: Date, end: Date;

  if (dateRange) {
    match.createdAt = dateRange.current;
    start = dateRange.current.$gte;
    end = dateRange.current.$lte;
  } else {
    const now = new Date();
    start = new Date(now.getFullYear(), now.getMonth(), 1);
    end = now;
  }

  const raw = await OrderModel.aggregate([
    { $match: match },
    {
      $group: {
        _id: {
          $dateToString: {
            format: mongoDateFormat,
            date: "$createdAt",
          },
        },
        totalOrders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        _id: 0,
        date: "$_id",
        totalOrders: 1,
      },
    },
  ]);

  return padMissingDates(raw, start, end, granularity, "totalOrders");
};
