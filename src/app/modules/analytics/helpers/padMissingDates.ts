import {
  eachDayOfInterval,
  eachMonthOfInterval,
  eachYearOfInterval,
  format,
} from "date-fns";

export const padMissingDates = (
  result: any,
  startDate: Date,
  endDate: Date,
  granularity: "day" | "month" | "year",
  field: string
) => {
  const filled: any[] = [];

  const dateFormat =
    granularity === "day"
      ? "yyyy-MM-dd"
      : granularity === "month"
      ? "yyyy-MM"
      : "yyyy";

  const displayFormat =
    granularity === "day"
      ? "d" // e.g., "1", "2", ..., "31"
      : granularity === "month"
      ? "MMM" // e.g., "1", "2", ..., "12"
      : "yyyy";

  const dateList =
    granularity === "day"
      ? eachDayOfInterval({ start: startDate, end: endDate })
      : granularity === "month"
      ? eachMonthOfInterval({ start: startDate, end: endDate })
      : eachYearOfInterval({
          start: new Date(new Date().getFullYear() - 10, 0, 1),
          end: endDate,
        });

  const resultMap = new Map(
    result.map((item: any) => [item.date, item[field]])
  );

  for (const d of dateList) {
    const rawKey = format(d, dateFormat); // for lookup
    const displayKey = format(d, displayFormat); // for output

    filled.push({
      date: displayKey,
      [field]: resultMap.get(rawKey) ?? 0,
    });
  }

  return filled;
};
