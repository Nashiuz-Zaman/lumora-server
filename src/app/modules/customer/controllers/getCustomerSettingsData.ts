import { RequestHandler } from "express";
import { catchAsync, sendSuccess } from "@utils/index";

import { ISecureRequest } from "@app/shared/types";
import { getCustomerSettingsData } from "../service";

export const getCustomerSettingsDataController: RequestHandler = catchAsync(
  async (req: ISecureRequest, res) => {
    const { userId } = req.decoded!;

    const customerData = await getCustomerSettingsData(userId as string);

    return sendSuccess(res, { data: customerData });
  }
);
