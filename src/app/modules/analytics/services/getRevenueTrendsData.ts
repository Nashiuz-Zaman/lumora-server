import { PaymentModel } from "@app/modules/payment/payment.model";
import {
  padMissingDates,
  getMongoDateFormat,
  getGranularityFromDateRange,
  extractDateRangeFilterFromQuery,
} from "../helpers";
import { PaymentType } from "@app/modules/payment/payment.constant";

export const getRevenueTrendsData = async (
  queryObj: Record<string, any>
): Promise<{ date: string; totalRevenue: number }[]> => {
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

  const raw = await PaymentModel.aggregate([
    { $match: match },
    {
      $group: {
        _id: {
          $dateToString: {
            format: mongoDateFormat,
            date: "$createdAt",
          },
        },
        // Subtract refunds by applying sign based on type
        totalRevenue: {
          $sum: {
            $cond: [
              { $eq: ["$type", PaymentType.payment] },
              "$amount",
              { $multiply: ["$amount", -1] },
            ],
          },
        },
      },
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        _id: 0,
        date: "$_id",
        totalRevenue: 1,
      },
    },
  ]);

  return padMissingDates(raw, start, end, granularity, "totalRevenue");
};
