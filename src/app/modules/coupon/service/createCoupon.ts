import { throwBadRequest } from "@utils/operationalErrors";
import { CouponModel } from "../coupon.model";
import { ICoupon } from "../coupon.type";

export const createCoupon = async (couponData: Partial<ICoupon>) => {
  const existing = await CouponModel.findOne({ code: couponData.code });
  if (existing) {
    throw new Error("Coupon code already exists");
  }

  if (
    couponData.discountType === "percentage" &&
    couponData.discountValue! > 100
  ) {
    return throwBadRequest("Percentage discount cannot be over 100");
  }

  return await CouponModel.create(couponData);
};
