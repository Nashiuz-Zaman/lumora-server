import { ICoupon } from "../coupon.type";

export const calculateCouponDiscount = (
  coupon: ICoupon,
  cartSubtotal: number
): number => {
  const discount =
    coupon.discountType === "flat"
      ? coupon.discountValue
      : (coupon.discountValue / 100) * cartSubtotal;

  return Math.min(discount, cartSubtotal);
};
