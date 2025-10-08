export const PaymentStatus = Object.freeze({
  Paid: 1,
  "Partially Refunded": 0,
  Refunded: -1,
} as const);

export type TPaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export const PaymentSearchableFields = Object.freeze([
  "orderId",
  "name",
  "email",
]);
