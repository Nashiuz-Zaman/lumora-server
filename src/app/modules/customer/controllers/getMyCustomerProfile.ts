import { RequestHandler } from "express";
import { getCustomerProfileData } from "../service/getCustomerProfileData";
import { sendSuccess, catchAsync } from "@utils/index";
import { ISecureRequest } from "@app/shared/types";

export const getMyCustomerProfileController: RequestHandler = catchAsync(
  async (req: ISecureRequest, res) => {
    const _id = req.decoded?.userId as string;
    const customerProfileData = await getCustomerProfileData(_id);
    return sendSuccess(res, { data: { customerProfileData } });
  }
);
