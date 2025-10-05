import { RequestHandler } from "express";

import { catchAsync } from "@utils/catchAsync";
import { sendSuccess } from "@utils/sendSuccess";
import { getPayments } from "../service/getPayments";

import { ISecureRequest } from "@app/shared/types";

export const getPaymentList: RequestHandler = catchAsync(
  async (req: ISecureRequest, res) => {
    const query = req.query;

    const result = await getPayments(query);

    return sendSuccess(res, {
      message: `Payments fetched successfully`,
      data: result,
    });
  }
);
