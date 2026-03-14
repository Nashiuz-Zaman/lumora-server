// core
import { RequestHandler } from "express";

// utils
import { catchAsync } from "@utils/catchAsync";
import { sendSuccess } from "@utils/sendSuccess";
import { cleanAuthCookies } from "../services/manageAuthCookies";

export const logout: RequestHandler = catchAsync(async (_, res) => {
  cleanAuthCookies(res);

  sendSuccess(res, { message: "Logged Out" });
});
