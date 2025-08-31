import { RequestHandler } from "express";
import { catchAsync } from "@utils/catchAsync";
import { sendSuccess } from "@utils/sendSuccess";
import { throwBadRequest } from "@utils/operationalErrors";
import { updateCouponStatus } from "../service/updateCouponStatus";
import { CouponStatus } from "../coupon.constant";

/**
 * Marks multiple coupons as expired.
 */
export const expireCouponsController: RequestHandler = catchAsync(
  async (req, res) => {
    const { expireIds = [] } = req.body;

    if (!Array.isArray(expireIds) || expireIds.length === 0) {
      throwBadRequest("No coupon IDs provided for expiration");
    }

    const results = await Promise.all(
      expireIds.map(async (couponId: string) => {
        try {
          await updateCouponStatus(couponId, CouponStatus.Expired);
          return { couponId, success: true };
        } catch (err) {
          console.error(`Failed to expire coupon ${couponId}:`, err);
          return {
            couponId,
            success: false,
            error: "Failed to mark as expired",
          };
        }
      })
    );

    const successCount = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success);

    return sendSuccess(res, {
      message: `${successCount} of ${expireIds.length} coupon(s) marked as expired`,
      data: {
        results, // Full list with status per coupon
        failed, // Only the failed ones
      },
    });
  }
);
