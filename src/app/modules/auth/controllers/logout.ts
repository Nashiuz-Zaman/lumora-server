// core
import { RequestHandler } from "express";

// utils
import { catchAsync, cleanCookie, sendSuccess } from "@utils/index";

export const logout: RequestHandler = catchAsync(async (_, res) => {
  cleanCookie(res, "Access_Token");
  cleanCookie(res, "Refresh_Token");

  sendSuccess(res, { message: "Logged Out" });
});
