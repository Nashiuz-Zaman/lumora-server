import { CouponModel } from "../coupon.model";
import { hasElements } from "@utils/hasElements";
import { throwBadRequest, throwInternalServerError } from "@utils/operationalErrors";
import { toObjectId } from "@utils/objectIdUtils";

export const deleteCoupons = async (_ids: string[]) => {
  if (!hasElements(_ids))
    return throwBadRequest("No coupon IDs provided for deletion");

  const objectIds = _ids.map(toObjectId);

  const result = await CouponModel.deleteMany({ _id: { $in: objectIds } });

  if (!result) return throwInternalServerError();

  return `${result.deletedCount} coupon(s) were deleted`;
};
