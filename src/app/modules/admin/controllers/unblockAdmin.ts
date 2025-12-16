import { unblockUser } from "@app/modules/user/services/unblockUsers";
import { ISecureRequest } from "@app/shared/types";
import {
  catchAsync,
  sendSuccess,
  throwInternalServerError,
} from "@utils/index";
import { RequestHandler } from "express";

export const unblockAdminController: RequestHandler = catchAsync(
  async (req: ISecureRequest, res) => {
    const result = await unblockUser(req?.decoded?.userDoc!);

    if (result)
      return sendSuccess(res, {
        message: "Admin successfully unblocked",
      });

    throwInternalServerError("Error unblocking customer");
  }
);
