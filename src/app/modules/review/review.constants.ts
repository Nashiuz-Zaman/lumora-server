export const ReviewStatus = Object.freeze({
  Deleted: -1,
  Pending: 0,
  Approved: 1,
} as const);

export type TReviewStatusValue =
  (typeof ReviewStatus)[keyof typeof ReviewStatus];

export const ReviewSearchableFields = Object.freeze([
  "name",
  "productName",
  "title",
] as const);
