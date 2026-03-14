import { RequestHandler } from "express";
import { catchAsync } from "@utils/catchAsync";
import { sendSuccess } from "@utils/sendSuccess";
import { throwInternalServerError } from "@utils/operationalErrors";
import { expireCoupons } from "../service/expireCoupons";

export const expireCouponsController: RequestHandler = catchAsync(
  async (req, res) => {
    const { ids: _ids = [] } = req.body;

    const message = await expireCoupons(_ids);

    if (message) return sendSuccess(res, { message });

    return throwInternalServerError();
  }
);
