export const ReturnRequestStatus = Object.freeze({
  Rejected: -1,
  Pending: 0,
  Approved: 1,
} as const);

export type TReturnRequestStatus =
  (typeof ReturnRequestStatus)[keyof typeof ReturnRequestStatus];

export const ReturnRequestSearchableFields = Object.freeze([
  "name",
  "email",
  "orderId",
  "phone",
] as const);

export const ReturnReasons = Object.freeze([
  "Wrong item delivered",
  "Missing items or accessories",
  "Item damaged/defective",
  "Product not as described",
  "Other",
] as const);

export type TReturnReason = (typeof ReturnReasons)[number];
