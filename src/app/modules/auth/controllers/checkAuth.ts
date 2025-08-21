// core
import { RequestHandler } from "express";

// utils
import { catchAsync, sendSuccess } from "@utils/index";

import { IJwtPayload } from "@shared/type/jwtPayload";
import { ISecureRequest } from "@shared/type/secureRequest";
import { UserModel } from "@app/modules/user/user.model";

export const checkAuth: RequestHandler = catchAsync(
  async (req: ISecureRequest, res) => {
    const { email } = req.user as IJwtPayload;

    let user = await UserModel.getUser(
      { email },
      {
        select: "id name email role image",
      }
    );

    if (user?._id) {
      return sendSuccess(res, { data: { user } });
    }
  }
);
