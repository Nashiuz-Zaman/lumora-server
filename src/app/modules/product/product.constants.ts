export const ProductSearchableFields = Object.freeze([
  "title",
  "brand",
] as const);

export const ProductStatus = Object.freeze({
  Deleted: -1,
  Draft: 0,
  Active: 1,
} as const);

export type TProductStatusValue =
  (typeof ProductStatus)[keyof typeof ProductStatus];

export const basicVariantKeys = [
  "sku",
  "price",
  "stock",
  "oldPrice",
  "discountPercentage",
  "weight",
  "width",
  "length",
  "height",
] as const;

export const stockLevels = {
  In_Stock: 20, // 20 and above is "in stock"
  Low_Stock: 1, // 1 to 19 is "low stock"
  Out_Of_Stock: 0, // 0 is "out of stock"
};
