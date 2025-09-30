export const PaymentStatus = Object.freeze({
  Deleted: -3,
  "Partially Refunded": -2,
  Refunded: -1,
  Cancelled: 0,
  Failed: 1,
  Paid: 2,
} as const);

export type TPaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export const PaymentSearchableFields = Object.freeze([
  "orderId",
  "customerName",
  "customerEmail",
]);
