export const PaymentType = Object.freeze({
  payment: "payment",
  refund: "refund",
} as const);

export type TPaymentType = (typeof PaymentType)[keyof typeof PaymentType];

export const PaymentSearchableFields = Object.freeze([
  "orderId",
  "name",
  "email",
]);
