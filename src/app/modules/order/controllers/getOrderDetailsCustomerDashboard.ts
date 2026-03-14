import { RequestHandler } from "express";
import { catchAsync } from "@utils/catchAsync";
import { sendSuccess } from "@utils/sendSuccess";
import { toObjectId } from "@utils/objectIdUtils";
import { ISecureRequest } from "@app/shared/types";
import { getOrder } from "../services/getOrder";

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
