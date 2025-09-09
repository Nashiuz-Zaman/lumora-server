import { IVariant } from "./product.type";

const BASIC_KEYS = [
  "_id",
  "id",
  "sku",
  "stock",
  "price",
  "oldPrice",
  "discountPercentage",
];

export const getVariantSpecs = (
  variant: IVariant
): Record<string, string> => {
  const attributes: Record<string, string> = {};

  for (const key in variant) {
    if (!BASIC_KEYS.includes(key)) {
      const value = variant[key];
      if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean"
      ) {
        attributes[key] = String(value);
      }
    }
  }

  return attributes;
};
