import { TGranularity } from "./getGranularityFromDateRange";

export const getMongoDateFormat = (granularity: TGranularity) => {
  switch (granularity) {
    case "day":
      return "%Y-%m-%d"; // e.g., "2024-07-27"
    case "month":
      return "%Y-%m"; // e.g., "2024-07"
    case "year":
      return "%Y"; // e.g., "2024"
    default:
      return "%Y";
  }
};
