import { RequestHandler } from "express";
import { validateAndChangePassword } from "../service";
import { sendSuccess, catchAsync } from "@utils/index";
import { ISecureRequest } from "@app/shared/types";

export const changeCustomerPasswordFromSettingsController: RequestHandler =
  catchAsync(async (req: ISecureRequest, res) => {
    const { currentPassword, newPassword } = req.body;
    const { userId } = req.decoded!;

    await validateAndChangePassword(userId!, currentPassword, newPassword);

    return sendSuccess(res, {
      message: "Password updated successfully",
    });
  });
