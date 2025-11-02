import { OrderModel } from "@app/modules/order/order.model";
import { OrderStatus } from "@app/modules/order/order.constants";
import { extractDateRangeFilterFromQuery } from "../helpers/extractDateRangeFilterFromQuery";
import { extractComparedData } from "../helpers/extractComparedData";

const orderStatsGroupingStageObject = {
  _id: null,
  totalOrders: { $sum: 1 },
  completedOrders: {
    $sum: {
      $cond: [{ $gte: ["$status", OrderStatus.Delivered] }, 1, 0],
    },
  },
  cancelledOrders: {
    $sum: {
      $cond: [{ $in: ["$status", [OrderStatus.Cancelled]] }, 1, 0],
    },
  },
  returnedOrders: {
    $sum: {
      $cond: [{ $eq: ["$status", OrderStatus.Returned] }, 1, 0],
    },
  },
};

const getAggregatedOrderStats = async (
  matchStage: Record<string, any> = {}
) => {
  const pipeline = [];

  if (Object.keys(matchStage)?.length > 0) {
    pipeline.push({ $match: matchStage });
  }

  pipeline.push({ $group: orderStatsGroupingStageObject });

  const result = await OrderModel.aggregate(pipeline);
  const stats: Record<string, number> | null = result[0] || null;

  return {
    totalOrders: stats?.totalOrders || 0,
    completedOrders: stats?.completedOrders || 0,
    cancelledOrders: stats?.cancelledOrders || 0,
    returnedOrders: stats?.returnedOrders || 0,
  };
};

export const getOrderStats = async (queryObj: Record<string, any>) => {
  const dateRange = extractDateRangeFilterFromQuery(queryObj);

  // If NO date range
  if (!dateRange) {
    const current = await getAggregatedOrderStats();

    return {
      totalOrders: { current: current.totalOrders },
      completedOrders: { current: current.completedOrders },
      cancelledOrders: { current: current.cancelledOrders },
      returnedOrders: { current: current.returnedOrders },
    };
  }

  // If date range
  const {
    current: currentRange,
    previous: previousRange,
    comparisonType,
  } = dateRange;

  const [current, previous] = await Promise.all([
    getAggregatedOrderStats({ createdAt: currentRange }),
    getAggregatedOrderStats({ createdAt: previousRange }),
  ]);

  const comparisonText =
    comparisonType === "month"
      ? "compared to last month"
      : comparisonType === "year"
      ? "compared to last year"
      : "";

  return {
    totalOrders: extractComparedData(current, previous, "totalOrders"),
    completedOrders: extractComparedData(current, previous, "completedOrders"),
    cancelledOrders: extractComparedData(current, previous, "cancelledOrders"),
    returnedOrders: extractComparedData(current, previous, "returnedOrders"),
    comparisonText,
  };
};
