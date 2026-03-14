import { RequestHandler } from "express";
import { catchAsync } from "@utils/catchAsync";
import { sendSuccess } from "@utils/sendSuccess";
import { throwInternalServerError } from "@utils/operationalErrors";
import { markOrdersDelivered } from "../services/markOrdersDelivered";

export const markOrdersDeliveredController: RequestHandler = catchAsync(
  async (req, res) => {
    const { _ids } = req.body;
    const result = await markOrdersDelivered(_ids);

    if (result) return sendSuccess(res, { message: result });

    return throwInternalServerError();
  }
);
