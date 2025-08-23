import { RequestHandler } from "express";
import { validateAndChangePassword } from "../service";
import {
  throwInternalServerError,
  sendSuccess,
  catchAsync,
} from "@utils/index";
import { ISecureRequest } from "@app/shared/types";

export const changeCustomerPasswordFromSettingsController: RequestHandler = catchAsync(
  async (req: ISecureRequest, res) => {
    const { currentPassword, newPassword } = req.body;
    const { userId } = req.decoded!;

    const updated = await validateAndChangePassword(
      userId!,
      currentPassword,
      newPassword
    );

    if (updated._id)
      return sendSuccess(res, {
        message: "Password updated successfully",
      });

    throwInternalServerError();
  }
);
