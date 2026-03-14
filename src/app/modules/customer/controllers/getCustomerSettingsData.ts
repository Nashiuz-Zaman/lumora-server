import { RequestHandler } from "express";
import { catchAsync } from "@utils/catchAsync";
import { sendSuccess } from "@utils/sendSuccess";

import { ISecureRequest } from "@app/shared/types";
import { getCustomerSettingsData } from "../service/getCustomerSettingsData";

export const getCustomerSettingsDataController: RequestHandler = catchAsync(
  async (req: ISecureRequest, res) => {
    const { userId } = req.decoded!;

    const customerData = await getCustomerSettingsData(userId as string);

    return sendSuccess(res, { data: customerData });
  }
);
