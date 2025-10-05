import { RequestHandler } from "express";
import {
  catchAsync,
  sendSuccess,
  throwInternalServerError,
} from "@utils/index";
import { markOrdersDelivered } from "../services";

export const markOrdersDeliveredController: RequestHandler = catchAsync(
  async (req, res) => {
    const { _ids } = req.body;
    const result = await markOrdersDelivered(_ids);

    if (result) return sendSuccess(res, { message: result });

    return throwInternalServerError();
  }
);
