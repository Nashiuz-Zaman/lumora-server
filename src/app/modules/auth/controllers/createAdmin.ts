// core
import { RequestHandler } from "express";

// utils
import { catchAsync, sendSuccess, serverError } from "../../../../utils";
import { UserModel } from "../../user/user.model";

export const createAdminController: RequestHandler = catchAsync(
  async (req, res) => {
    const user = req.body;

    const newUser = await UserModel.create(user);

    if (newUser._id) return sendSuccess(res, { data: user });

    serverError();
  }
);
