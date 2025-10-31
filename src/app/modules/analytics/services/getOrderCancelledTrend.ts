import { OrderModel } from "@app/modules/order/order.model";
import {
  extractDateRangeFilterFromQuery,
  getGranularityFromDateRange,
  padMissingDates,
  getMongoDateFormat,
} from "../helpers";
import { OrderStatus } from "@app/modules/order/order.constants";

export const getOrderCancelledTrend = async (
  queryObj: Record<string, any>
): Promise<{ date: string; totalOrders: number }[]> => {
  const dateRange = extractDateRangeFilterFromQuery(queryObj);
  const granularity = getGranularityFromDateRange(dateRange);
  const mongoDateFormat = getMongoDateFormat(granularity);

  // Build match condition and date bounds
  let match: Record<string, any> = { status: OrderStatus.Cancelled };
  let start: Date;
  let end: Date;

  if (dateRange) {
    match.activities = {
      $elemMatch: {
        status: OrderStatus.Cancelled,
        time: dateRange.current,
      },
    };
    start = dateRange.current.$gte;
    end = dateRange.current.$lte;
  } else {
    // If no dateRange, we still want orders that have a cancelled activity element.
    match.activities = {
      $elemMatch: { status: OrderStatus.Cancelled },
    };

    const now = new Date();
    start = new Date(now.getFullYear(), now.getMonth(), 1);
    end = now;
  }

  // Aggregation pipeline
  const raw = await OrderModel.aggregate([
    // Only cancelled orders
    { $match: match },

    // Extract only cancelled activity from activities array
    {
      $addFields: {
        cancelledActivity: {
          $filter: {
            input: "$activities",
            as: "a",
            cond: { $eq: ["$$a.status", OrderStatus.Cancelled] },
          },
        },
      },
    },

    //  Flatten those activities
    { $unwind: "$cancelledActivity" },

    // Group by formatted date string
    {
      $group: {
        _id: {
          $dateToString: {
            format: mongoDateFormat,
            date: "$cancelledActivity.time",
          },
        },
        totalOrders: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        date: "$_id",
        totalOrders: 1,
      },
    },
    { $sort: { date: 1 } },
  ]);

  return padMissingDates(raw, start, end, granularity, "totalOrders");
};
