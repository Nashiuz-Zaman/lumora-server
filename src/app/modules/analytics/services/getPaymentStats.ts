import { PaymentType } from "@app/modules/payment/payment.constant";
import {
  extractDateRangeFilterFromQuery,
  extractComparedData,
} from "../helpers";
import { PaymentModel } from "@app/modules/payment/payment.model";

const paymentStatsGroupStage = {
  _id: null,
  paidPayments: {
    $sum: {
      $cond: [{ $eq: ["$type", PaymentType.payment] }, "$amount", 0],
    },
  },
  refundedPayments: {
    $sum: {
      $cond: [{ $eq: ["$type", PaymentType.refund] }, "$amount", 0],
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
  };
};

interface IPaymentComparison {
  current: number;
  previous?: number;
  difference?: number;
  percentageChange?: number;
}

interface IGetPaymentStatsReturn {
  paidPayments: IPaymentComparison;
  refundedPayments: IPaymentComparison;
  comparisonText?: string;
}

export const getPaymentStats = async (
  queryObj: Record<string, any>
): Promise<IGetPaymentStatsReturn> => {
  const dateRange = extractDateRangeFilterFromQuery(queryObj);

  if (!dateRange) {
    const current = await getAggregatedPaymentStats();

    return {
      paidPayments: { current: current.paidPayments },
      refundedPayments: { current: current.refundedPayments },
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
    comparisonText,
  };
};
