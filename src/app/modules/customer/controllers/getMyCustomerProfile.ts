import { Request, RequestHandler, Response } from "express";
import { getCustomerProfileData } from "../service/getCustomerProfileData";
import { sendSuccess, catchAsync } from "@utils/index";

export const getMyCustomerProfileController: RequestHandler = catchAsync(
  async (req, res) => {
    const userId = req.params.id;

    const data = await getCustomerProfileData(userId);

    return sendSuccess(res, { data });
  }
);
