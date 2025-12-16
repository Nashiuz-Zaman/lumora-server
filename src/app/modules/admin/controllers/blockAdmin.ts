import { blockUser } from "@app/modules/user/services/blockUsers";
import { ISecureRequest } from "@app/shared/types";
import {
  catchAsync,
  sendSuccess,
  throwInternalServerError,
} from "@utils/index";

import { RequestHandler } from "express";

export const blockAdminController: RequestHandler = catchAsync(
  async (req: ISecureRequest, res) => {
    const result = await blockUser(req?.decoded?.userDoc!);

    if (result)
      return sendSuccess(res, {
        message: "Admin successfully blocked",
      });

    return throwInternalServerError("Error blocking customer");
  }
);
