import {
  extractDateRangeFilterFromQuery,
  extractComparedData,
} from "../helpers";
import { PaymentStatus } from "@app/modules/payment/payment.constant";
import { PaymentModel } from "@app/modules/payment/payment.model";

const paymentStatsGroupStage = {
  _id: null,
  paidPayments: {
    $sum: {
      $cond: [{ $eq: ["$status", PaymentStatus.Paid] }, "$amount", 0],
    },
  },
  refundedPayments: {
    $sum: {
      $cond: [{ $eq: ["$status", PaymentStatus.Refunded] }, "$amount", 0],
    },
  },
  partiallyRefunded: {
    $sum: {
      $cond: [
        { $eq: ["$status", PaymentStatus["Partially Refunded"]] },
        "$amount",
        0,
      ],
    },
  },
};


const getAggregatedPaymentStats = async (
  matchStage: Record<string, any> = {}
) => {
  const pipeline = [];

  if (Object.keys(matchStage).length > 0) {
    pipeline.push({ $match: matchStage });
  }

  pipeline.push({ $group: paymentStatsGroupStage });

  const result = await PaymentModel.aggregate(pipeline);
  const stats = result[0] || {};

  return {
    paidPayments: stats.paidPayments || 0,
    refundedPayments: stats.refundedPayments || 0,
    partiallyRefundedPayments: stats.partiallyRefundedPayments || 0,
  };
};

/**
 * Gets order stats for dashboard (with comparison support)
 */
export const getPaymentStats = async (queryObj: Record<string, any>) => {
  const dateRange = extractDateRangeFilterFromQuery(queryObj);

  if (!dateRange) {
    const current = await getAggregatedPaymentStats();

    return {
      paidPayments: { current: current.paidPayments },
      refundedPayments: { current: current.refundedPayments },
      partiallyRefundedPayments: { current: current.partiallyRefundedPayments },
    };
  }

  const {
    current: currentRange,
    previous: previousRange,
    comparisonType,
  } = dateRange;

  const [current, previous] = await Promise.all([
    getAggregatedPaymentStats({ createdAt: currentRange }),
    getAggregatedPaymentStats({ createdAt: previousRange }),
  ]);

  const comparisonPhrase = "since";
  const comparisonText =
    comparisonType === "month"
      ? `${comparisonPhrase} last month`
      : comparisonType === "year"
      ? `${comparisonPhrase} last year`
      : "";

  return {
    paidPayments: extractComparedData(current, previous, "paidPayments"),
    refundedPayments: extractComparedData(
      current,
      previous,
      "refundedPayments"
    ),
    partiallyRefundedPayments: extractComparedData(current, previous, "partiallyRefundedPayments"),
    comparisonText,
  };
};
