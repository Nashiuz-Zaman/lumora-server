import { RequestHandler } from "express";
import { catchAsync, sendSuccess, toObjectId } from "@utils/index";
import { ISecureRequest } from "@app/shared/types";
import { getOrder } from "../services";

export const getOrderDetailsCustomerDashboardController: RequestHandler =
  catchAsync(async (req: ISecureRequest, res) => {
    const userId = toObjectId(req.decoded?.userId!);

    const queryObj = {
      ...req.query,
      user: userId,
    };

    const data = await getOrder(queryObj, {});

    return sendSuccess(res, {
      data: { orderDetails: data },
    });
  });
