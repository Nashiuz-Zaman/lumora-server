export const CouponSearchableFields = Object.freeze(["code"]);

export const CouponStatus = Object.freeze({
  Deleted: -1,
  Expired: 0,
  Active: 1,
} as const);

export type TCouponStatus = (typeof CouponStatus)[keyof typeof CouponStatus];
