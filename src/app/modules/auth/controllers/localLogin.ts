// core
import { RequestHandler } from "express";

// utils
import { catchAsync } from "@utils/catchAsync";
import { sendSuccess } from "@utils/sendSuccess";
import { localLogin } from "../services/localLogin";

export const localLoginController: RequestHandler = catchAsync(
  async (req, res) => {
    const { email, password } = req.body;

    const user = await localLogin({
      res,
      email: email.trim(),
      password: password?.trim(),
    });

    return sendSuccess(res, { data: { user },message: 'Login Successful' });
  }
);
