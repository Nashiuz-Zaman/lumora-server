import { CouponModel } from "../coupon.model";
import { throwBadRequest, throwNotFound } from "@utils/operationalErrors";

export const updateCouponStatus = async (
  couponId: string,
  newStatus: number
): Promise<void> => {
  const result = await CouponModel.updateOne(
    { _id: couponId },
    { $set: { status: newStatus } }
  );

  if (result.matchedCount === 0) {
    throwNotFound("Coupon not found");
  }

  if (result.modifiedCount === 0) {
    throwBadRequest("Coupon status is already set to the given value");
  }
};
