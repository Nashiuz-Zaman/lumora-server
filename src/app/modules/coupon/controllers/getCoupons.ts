// Core
import { RequestHandler } from "express";

// Utils
import { catchAsync } from "@utils/catchAsync";
import { sendSuccess } from "@utils/sendSuccess";
import { throwInternalServerError } from "@utils/operationalErrors";

// Services
import { getCoupons } from "../service/getCoupons";

export const getCouponsController: RequestHandler = catchAsync(async (req, res) => {
  const query = req.query;
  const coupons = await getCoupons(query);

  if (coupons)
    return sendSuccess(res, {
      data: coupons,
    });

  return throwInternalServerError();
});
