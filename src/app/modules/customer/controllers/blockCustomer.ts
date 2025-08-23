import { RequestHandler } from "express";
import { blockUser } from "@app/modules/user/services";
import {
  catchAsync,
  throwInternalServerError,
  sendSuccess,
} from "@utils/index";
import { ISecureRequest } from "@app/shared/types";

export const blockCustomerController: RequestHandler = catchAsync(
  async (req: ISecureRequest, res) => {
    const result = await blockUser(req?.decoded?.userDoc!);

    if (result)
      return sendSuccess(res, {
        message: "Customer successfully blocked",
      });

    throwInternalServerError("Error blocking customer");
  }
);
