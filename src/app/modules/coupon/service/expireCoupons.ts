// service/expireCoupons.ts
import { CouponModel } from "../coupon.model";
import { CouponStatus } from "../coupon.constant";
import { hasElements } from "@utils/hasElements";
import { throwBadRequest } from "@utils/operationalErrors";
import { toObjectId } from "@utils/objectIdUtils";

export const expireCoupons = async (_ids: string[]) => {
  if (!hasElements(_ids))
    return throwBadRequest("No coupon IDs provided for expiration");

  const objectIds = _ids.map(toObjectId);

  const result = await CouponModel.updateMany(
    { _id: { $in: objectIds }, status: { $ne: CouponStatus.Expired } },
    { $set: { status: CouponStatus.Expired } }
  );

  return `${result.modifiedCount} coupon(s) were expired`;
};
