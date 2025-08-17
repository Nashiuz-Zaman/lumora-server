import { softDeleteUser } from "@app/modules/user/services/softDeleteUser";
import { ISecureRequest } from "@shared/type/secureRequest";
import {
  catchAsync,
  sendSuccess,
  throwInternalServerError,
} from "@utils/index";
import { RequestHandler } from "express";

export const deleteAdminController: RequestHandler = catchAsync(
  async (req: ISecureRequest, res) => {
    const result = await softDeleteUser(req?.userDoc!);

    if (result)
      return sendSuccess(res, {
        message: "Admin successfully deleted",
      });

    return throwInternalServerError("Error deleting admin");
  }
);
