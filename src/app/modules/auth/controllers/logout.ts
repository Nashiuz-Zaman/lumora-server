// core
import { RequestHandler } from "express";

// utils
import { catchAsync, sendSuccess } from "@utils/index";

export const logout: RequestHandler = catchAsync(async (_, res) => {
  // Clear Access_Token
  res.clearCookie("Access_Token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    domain:
      process.env.NODE_ENV === "production"
        ? "lumora-server.vercel.app"
        : undefined,
    path: "/",
  });

  // Clear Refresh_Token
  res.clearCookie("Refresh_Token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    domain: "lumora-server.vercel.app",

    path: "/",
  });

  sendSuccess(res, { message: "Logged Out" });
});
