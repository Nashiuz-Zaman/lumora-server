// core
import { RequestHandler } from "express";

// utils
import { catchAsync } from "@utils/index";
import { verifyUserAccountEmail } from "@app/modules/user/services/verifyUserAccountEmail";

export const confirmUserAccountController: RequestHandler = catchAsync(async (req, res) => {
  const { token, email } = req.query;

  await verifyUserAccountEmail(req, res, email as string, token as string);
});
