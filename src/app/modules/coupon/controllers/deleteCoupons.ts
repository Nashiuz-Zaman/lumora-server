import { RequestHandler } from "express";
import { catchAsync } from "@utils/catchAsync";
import { sendSuccess } from "@utils/sendSuccess";
import { deleteCoupons } from "../service/deleteCoupons";

export const deleteCouponsController: RequestHandler = catchAsync(
  async (req, res) => {
    const { ids: _ids = [] } = req.body;

    const message = await deleteCoupons(_ids);
    return sendSuccess(res, { message });
  }
);
