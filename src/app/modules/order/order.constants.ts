export const OrderStatus = Object.freeze({
  Deleted: -3,
  Returned: -2,
  Cancelled: -1,
  Pending: 0,
  Confirmed: 1,
  Shipped: 2,
  Delivered: 3,
} as const);

export type TOrderStatusValue = (typeof OrderStatus)[keyof typeof OrderStatus];

export const OrderSearchableFields = Object.freeze([
  "name",
  "email",
  "orderId",
] as const);
