// libraries
import { RequestHandler } from "express";

// types
import { ISecureRequest } from "@app/shared/types";

// services
import { updateBasicInfo } from "../service/updateBasicInfo";

// utils
import { catchAsync, sendSuccess } from "@utils/index";

export const updateCustomerBasicInfoController: RequestHandler = catchAsync(
  async (req: ISecureRequest, res) => {
    const { userId } = req.decoded!;
    await updateBasicInfo(userId!, req.body);
    return sendSuccess(res, {
      message: "Customer info updated successfully",
    });
  }
);
