import {
  throwBadRequest,
  throwInternalServerError,
} from "@utils/operationalErrors";
import { CouponModel } from "../coupon.model";
import { ClientSession } from "mongoose";

export const decrementCouponUsageByCode = async (
  code: string,
  session?: ClientSession
) => {
  const updateQuery = CouponModel.updateOne(
    {
      code: code.toUpperCase().trim(),
      usedCount: { $gt: 0 },
    },
    { $inc: { usedCount: -1 } }
  );

  if (session) {
    updateQuery.session(session);
  }

  const result = await updateQuery;

  if (result.matchedCount === 0) {
    throwBadRequest("Coupon not found or usage count is already zero");
  }

  if (result.modifiedCount === 0) {
    throwInternalServerError("Failed to decrement coupon usage");
  }
};
