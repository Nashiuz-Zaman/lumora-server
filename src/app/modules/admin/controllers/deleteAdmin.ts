import { RequestHandler } from "express";
import { softDeleteUser } from "@app/modules/user/services";
import { ISecureRequest } from "@app/shared/types";
import {
  catchAsync,
  sendSuccess,
  throwInternalServerError,
} from "@utils/index";

export const deleteAdminController: RequestHandler = catchAsync(
  async (req: ISecureRequest, res) => {
    const result = await softDeleteUser(req?.decoded?.userDoc!);

    if (result)
      return sendSuccess(res, {
        message: "Admin successfully deleted",
      });

    return throwInternalServerError("Error deleting admin");
  }
);
