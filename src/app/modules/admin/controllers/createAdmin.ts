// Core
import { RequestHandler } from "express";

// Models
import { UserModel } from "../../user/user.model";

// Utils
import {
  catchAsync,
  sendSuccess,
  throwInternalServerError,
} from "@utils/index";

export const createAdminController: RequestHandler = catchAsync(
  async (req, res) => {
    const user = req.body;

    const newUser = await UserModel.create(user);

    if (newUser._id) return sendSuccess(res, { data: user });

    throwInternalServerError();
  }
);
