import { RequestHandler } from "express";
import { sendSuccess } from "@utils/sendSuccess";
import { socialLoginOrRegisterUser } from "../services/socialLogin";
import { catchAsync } from "@utils/catchAsync";
import { setAuthCookies } from "@app/modules/auth/setAuthCookies";
import { IRole } from "@app/modules/role/type/role.type";
import { throwInternalServerError } from "@utils/operationalErrors";

/**
 * @route POST /auth/social-login
 * @desc Social login or registration for customer users
 * @access Public
 */
export const socialLoginController: RequestHandler = catchAsync(
  async (req, res) => {
    const { name, email, image } = req.body;

    const user = await socialLoginOrRegisterUser({ name, email, image });

    if (!user) return throwInternalServerError("Social login failed");

    if (user?.role) {
      // extract role
      const role = (user.role as unknown as IRole).name;

      setAuthCookies(res, user?.email!, role, user?._id?.toString()!);
    }

    return sendSuccess(res, {
      message: "Login successful",
      data: { user },
    });
  }
);
