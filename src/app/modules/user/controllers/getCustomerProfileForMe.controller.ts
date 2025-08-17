import { Request, Response } from "express";

import { catchAsync } from "@utils/catchAsync";
import { getCustomerProfileData } from "../services/getCustomerProfileData";
import { sendSuccess } from "@utils/sendSuccess";

export const getCustomerProfileForMe = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.params.id;

    const data = await getCustomerProfileData(userId);

    return sendSuccess(res, { data });
  }
);
