// Core
import { RequestHandler } from "express";

// Utils
import { catchAsync, sendSuccess, throwBadRequest } from "@utils/index";

// Services
import { updateCouponStatus } from "../service/updateCouponStatus";

// Constants
import { CouponStatus } from "../coupon.constant";

export const deleteCouponsController: RequestHandler = catchAsync(
  async (req, res) => {
    const { deleteIds = [] } = req.body;

    if (!Array.isArray(deleteIds) || deleteIds.length === 0) {
      throwBadRequest("No coupon IDs provided for deletion");
    }

    const results = await Promise.all(
      deleteIds.map(async (couponId: string) => {
        try {
          await updateCouponStatus(couponId, CouponStatus.Deleted);
          return { couponId, success: true };
        } catch (err) {
          console.error(`Failed to delete coupon ${couponId}:`, err);
          return {
            couponId,
            success: false,
            error: "Failed to delete coupon",
          };
        }
      })
    );

    const successCount = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success);

    return sendSuccess(res, {
      message: `${successCount} of ${deleteIds.length} coupon(s) deleted`,
      data: {
        results,
        failed,
      },
    });
  }
);
