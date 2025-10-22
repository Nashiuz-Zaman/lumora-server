import { IDateRangeFilter } from "./extractDateRangeFilterFromQuery";

export type TGranularity = "day" | "month" | "year";

export const getGranularityFromDateRange = (
  rangeOutput: IDateRangeFilter | null
): TGranularity => {
  if (!rangeOutput) return "year";

  const { comparisonType, current } = rangeOutput;

  // Explicit comparison types override
  if (comparisonType === "year") return "month";
  if (comparisonType === "month") {
    const diffInDays =
      (current.$lte.getTime() - current.$gte.getTime()) / (1000 * 60 * 60 * 24);
    return diffInDays <= 31 ? "day" : "month"; // fallback safety
  }

  return "year";
};
