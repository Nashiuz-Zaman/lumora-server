import { PaymentModel } from "@app/modules/payment/payment.model";
import { PaymentStatus } from "@app/modules/payment/payment.constant";
import {
  padMissingDates,
  getMongoDateFormat,
  getGranularityFromDateRange,
  extractDateRangeFilterFromQuery,
} from "../helpers";

export const getRevenueTrendsData = async (
  queryObj: Record<string, any>
): Promise<Array<{ date: string; totalRevenue: number }>> => {
  const dateRange = extractDateRangeFilterFromQuery(queryObj);
  const granularity = getGranularityFromDateRange(dateRange);
  const mongoDateFormat = getMongoDateFormat(granularity);

  const match: Record<string, any> = {
    status: PaymentStatus.Paid,
  };
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
        totalRevenue: { $sum: "$amount" },
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
