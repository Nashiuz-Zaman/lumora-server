import { RequestHandler } from "express";

// Shared types
import { ISecureRequest } from "@app/shared/types";

// Utils
import {
  catchAsync,
  sendSuccess,
  throwInternalServerError,
} from "@utils/index";

// Services
import { getPayments } from "../service/getPayments";

export const getPaymentList: RequestHandler = catchAsync(
  async (req: ISecureRequest, res) => {
    const query = req.query;

    const result = await getPayments(query);

    if (result)
      return sendSuccess(res, {
        data: result,
      });

    return throwInternalServerError();
  }
);
