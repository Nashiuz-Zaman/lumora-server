import {
  throwInternalServerError,
  throwNotFound,
} from "@utils/operationalErrors";
import { CouponModel } from "../coupon.model";
import { ClientSession } from "mongoose";

export const incrementCouponUsageByCode = async (
  code: string,
  session?: ClientSession
) => {
  const update = CouponModel.updateOne(
    { code: code.toUpperCase().trim() },
    { $inc: { usedCount: 1 } }
  );
  if (session) update.session(session);
  const result = await update;

  if (result.matchedCount === 0) {
    throwNotFound("Coupon not found");
  }

  if (result.modifiedCount === 0) {
    throwInternalServerError("Failed to increment coupon usage");
  }
};
