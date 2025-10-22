import { calculateChange } from "./calculateChange";

export const extractComparedData = (
  current: Record<string, number>,
  previous: Record<string, number>,
  key: string
) => {
  const currentVal = current[key] || 0;
  const previousVal = previous[key] || 0;

  return {
    current: currentVal,
    previous: previousVal,
    comparison: calculateChange(currentVal, previousVal),
  };
};
