export function formatPrice(
  price: string | number,
  includeCurrencySymbol: boolean = true
): string {
  const num = Number(price);
  if (isNaN(num)) return "0.00";

  return num.toLocaleString("en-US", {
    style: includeCurrencySymbol ? "currency" : "decimal",
    currency: "USD",
    currencyDisplay: "narrowSymbol", 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
