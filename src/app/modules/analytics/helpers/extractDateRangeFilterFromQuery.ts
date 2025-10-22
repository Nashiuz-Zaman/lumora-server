import {
  endOfMonth,
  endOfYear,
  startOfMonth,
  startOfYear,
  subMonths,
  subYears,
} from "date-fns";

export interface IDateRangeFilter {
  current: { $gte: Date; $lte: Date };
  previous: { $gte: Date; $lte: Date };
  comparisonType: "month" | "year" | null;
}

export const extractDateRangeFilterFromQuery = (
  query: Record<string, any>
): IDateRangeFilter | null => {
  let { month, year } = query;
  const now = new Date();
  const currentYear = now.getFullYear();

  // All-time case
  if (typeof month === "undefined" && typeof year === "undefined") {
    return null;
  }

  month = month ? Number(month) : undefined;
  year = year ? Number(year) : undefined;

  // Only month provided (assume current year)
  if (typeof month === "number" && typeof year === "undefined") {
    const currentStart = startOfMonth(new Date(currentYear, month - 1));
    const currentEnd = endOfMonth(new Date(currentYear, month - 1));
    const previousStart = startOfMonth(subMonths(currentStart, 1));
    const previousEnd = endOfMonth(subMonths(currentStart, 1));

    return {
      current: { $gte: currentStart, $lte: currentEnd },
      previous: { $gte: previousStart, $lte: previousEnd },
      comparisonType: "month",
    };
  }

  // Only year provided
  if (typeof month === "undefined" && typeof year === "number") {
    const currentStart = startOfYear(new Date(year, 0));
    const currentEnd = endOfYear(new Date(year, 0));
    const previousStart = startOfYear(subYears(currentStart, 1));
    const previousEnd = endOfYear(subYears(currentStart, 1));

    return {
      current: { $gte: currentStart, $lte: currentEnd },
      previous: { $gte: previousStart, $lte: previousEnd },
      comparisonType: "year",
    };
  }

  // Both year and month provided
  if (typeof month === "number" && typeof year === "number") {
    const currentStart = startOfMonth(new Date(year, month - 1));
    const currentEnd = endOfMonth(new Date(year, month - 1));
    const previousStart = startOfMonth(subMonths(currentStart, 1));
    const previousEnd = endOfMonth(subMonths(currentStart, 1));

    return {
      current: { $gte: currentStart, $lte: currentEnd },
      previous: { $gte: previousStart, $lte: previousEnd },
      comparisonType: "month",
    };
  }

  // Fallback to all-time if invalid
  return null;
};
