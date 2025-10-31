import { CustomerModel } from "@app/modules/customer/customer.model";
import {
  extractDateRangeFilterFromQuery,
  getGranularityFromDateRange,
  getMongoDateFormat,
  padMissingDates,
} from "../helpers";

export const getCustomerGrowthTrends = async (
  query: Record<string, any>
): Promise<{ date: string; totalCustomers: number }[]> => {
  const dateRange = extractDateRangeFilterFromQuery(query);
  const granularity = getGranularityFromDateRange(dateRange);
  const mongoDateFormat = getMongoDateFormat(granularity);

  let start: Date, end: Date;
  const match: Record<string, any> = {};

  if (dateRange) {
    match.createdAt = dateRange.current;
    start = dateRange.current.$gte;
    end = dateRange.current.$lte;
  } else {
    const now = new Date();
    start = new Date(now.getFullYear(), now.getMonth(), 1);
    end = now;
  }

  const raw = await CustomerModel.aggregate([
    { $match: match },
    {
      $group: {
        _id: {
          $dateToString: {
            format: mongoDateFormat,
            date: "$createdAt",
          },
        },
        totalCustomers: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        _id: 0,
        date: "$_id",
        totalCustomers: 1,
      },
    },
  ]);

  return padMissingDates(raw, start, end, granularity, "totalCustomers");
};
