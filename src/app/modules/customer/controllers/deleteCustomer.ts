import { RequestHandler } from "express";
import { softDeleteUser } from "@app/modules/user/services";
import { ISecureRequest } from "@app/shared/types";
import {
  catchAsync,
  sendSuccess,
  throwInternalServerError,
} from "@utils/index";

export const deleteCustomerController: RequestHandler = catchAsync(
  async (req: ISecureRequest, res) => {
    const result = await softDeleteUser(req?.decoded?.userDoc!);

    if (result)
      return sendSuccess(res, {
        message: "Customer successfully deleted",
      });

    throwInternalServerError("Error deleting customer");
  }
);
