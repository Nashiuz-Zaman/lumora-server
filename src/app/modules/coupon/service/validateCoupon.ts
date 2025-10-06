import { CouponStatus } from "../coupon.constant";
import { CouponModel } from "../coupon.model";
import { ClientSession } from "mongoose";
import { throwBadRequest } from "@utils/index";

export const validateCoupon = async (
  code: string,
  subtotal: number,
  session?: ClientSession
) => {
  const query = CouponModel.findOne({ code: code.trim()?.toUpperCase() });
  if (session) query.session(session);
  const coupon = await query;

  if (!coupon || coupon.status !== CouponStatus.Active)
    return throwBadRequest("Invalid or inactive coupon code");

  const now = new Date();

  if (now < coupon.startDate)
    return throwBadRequest("This coupon is not yet active");

  if (now > coupon.expiryDate)
    return throwBadRequest("This coupon has expired");

  if (
    typeof coupon.usageLimit === "number" &&
    (coupon.usedCount ?? 0) >= coupon.usageLimit
  )
    return throwBadRequest("This coupon has reached its usage limit");

  if (subtotal < (coupon.minimumOrderAmount ?? 0))
    return throwBadRequest(
      `Minimum order amount of $${coupon.minimumOrderAmount} is required to use this coupon`
    );

  return coupon;
};
