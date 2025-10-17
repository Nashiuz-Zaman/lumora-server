export const OrderStatus = Object.freeze({
  Pending: 0,
  Confirmed: 1,
  Shipped: 2,
  Delivered: 3,
  Cancelled: 4,
  Returned: 5,
} as const);

export type TOrderStatusValue = (typeof OrderStatus)[keyof typeof OrderStatus];

export const OrderSearchableFields = Object.freeze([
  "name",
  "email",
  "orderId",
  "phone",
] as const);
