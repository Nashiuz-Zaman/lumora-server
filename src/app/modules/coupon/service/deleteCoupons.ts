
import { CouponModel } from "../coupon.model";
import { throwBadRequest, toObjectId } from "@utils/index";

export const deleteCoupons = async (_ids: string[]) => {
  if (!Array.isArray(_ids) || _ids.length === 0)
    return throwBadRequest("No coupon IDs provided for deletion");

  const objectIds = _ids.map(toObjectId);

  const result = await CouponModel.deleteMany({ _id: { $in: objectIds } });

  return `${result.deletedCount} coupon(s) were deleted`;
};
