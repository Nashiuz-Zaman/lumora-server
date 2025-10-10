// core
import { RequestHandler } from "express";

// utils
import { catchAsync, cleanCookie, sendSuccess } from "@utils/index";
import { cleanAuthCookies } from "../services";

export const logout: RequestHandler = catchAsync(async (_, res) => {
  cleanAuthCookies(res);

  sendSuccess(res, { message: "Logged Out" });
});
