import { catchAsync } from "@utils/catchAsync";

import { sendSuccess } from "@utils/sendSuccess";
import { RequestHandler } from "express";
import { confirmSslIpnPayment } from "../service/confirmSslIpnPayment";

export const handleIpnController: RequestHandler = catchAsync(
  async (req, res) => {
    const result = await confirmSslIpnPayment(req.body);

    console.log(result);
    return sendSuccess(res);
  }
);
