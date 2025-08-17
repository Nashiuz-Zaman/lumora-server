import { unblockUser } from "@app/modules/user/services/unblockUser";
import { ISecureRequest } from "@shared/type/secureRequest";
import {
  catchAsync,
  sendSuccess,
  throwInternalServerError,
} from "@utils/index";
import { RequestHandler } from "express";

export const unblockAdminController: RequestHandler = catchAsync(
  async (req: ISecureRequest, res) => {
    const result = await unblockUser(req?.userDoc!);

    if (result)
      return sendSuccess(res, {
        message: "Admin successfully unblocked",
      });

    throwInternalServerError("Error unblocking customer");
  }
);
