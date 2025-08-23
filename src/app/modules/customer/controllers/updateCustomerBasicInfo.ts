// libraries
import { RequestHandler } from "express";

// types
import { ISecureRequest } from "@app/shared/types";

// services
import { updateBasicInfo } from "../service/updateBasicInfo";

// utils
import {
  catchAsync,
  sendSuccess,
  throwInternalServerError,
} from "@utils/index";

export const updateCustomerBasicInfoController: RequestHandler = catchAsync(
  async (req: ISecureRequest, res) => {
    const { userId } = req.decoded!;

    const updated = await updateBasicInfo(userId!, req.body);

    if (updated)
      return sendSuccess(res, {
        message: "Customer info updated successfully",
      });

    throwInternalServerError();
  }
);
