import { catchAsync } from "@utils/catchAsync";

import { sendSuccess } from "@utils/sendSuccess";
import { RequestHandler } from "express";
import { confirmSslIpnPaymentService } from "../service/confirmSslIpnPayment";

export const handleSSLIpnController: RequestHandler = catchAsync(
  async (req, res) => {
    const result = await confirmSslIpnPaymentService(req.body);

    console.log(result);
    return sendSuccess(res);
  }
);
