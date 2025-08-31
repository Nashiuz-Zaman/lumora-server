export const convertToTwoDecimalNumber = (v: string | number) => {
  const num = parseFloat(v.toString().replace(/[^\d.]/g, ""));

  if (isNaN(num)) return 0;

  return Number(num.toFixed(2));
};
