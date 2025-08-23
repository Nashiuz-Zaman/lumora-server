// Core
import { RequestHandler } from "express";

// Models/Types
import { IRole } from "@app/modules/role/type/role.type";

// Services
import { setAuthCookies, socialLoginOrRegisterUser } from "../services";

// Utils
import {
  sendSuccess,
  catchAsync,
  throwInternalServerError,
} from "@utils/index";

export const socialLoginController: RequestHandler = catchAsync(
  async (req, res) => {
    const { name, email, image } = req.body;

    const user = await socialLoginOrRegisterUser({ name, email, image });

    if (!user) return throwInternalServerError("Social login failed");

    if (user?.role) {
      // extract role
      const role = (user.role as unknown as IRole).name;

      setAuthCookies(res, {
        email: user?.email!,
        role,
        userId: user?._id?.toString()!,
      });
    }

    return sendSuccess(res, {
      message: "Login successful",
      data: { user },
    });
  }
);
