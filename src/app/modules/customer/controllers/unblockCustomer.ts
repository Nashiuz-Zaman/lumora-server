// libraries
import { RequestHandler } from "express";

// types
import { ISecureRequest } from "@app/shared/types";

// services
import { unblockUser } from "@app/modules/user/services";

// utils
import {
  catchAsync,
  sendSuccess,
  throwInternalServerError,
} from "@utils/index";

export const unblockCustomerController: RequestHandler = catchAsync(
  async (req: ISecureRequest, res) => {
    const result = await unblockUser(req?.decoded?.userDoc!);

    if (result)
      return sendSuccess(res, {
        message: "Customer successfully unblocked",
      });

    throwInternalServerError("Error unblocking customer");
  }
);
