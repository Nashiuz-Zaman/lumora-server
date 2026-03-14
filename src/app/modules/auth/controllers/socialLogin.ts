// Core
import { RequestHandler } from "express";

// Models/Types
import { IRole } from "@app/modules/role/type/role.type";

// Services
import { setAuthCookies } from "../services/manageAuthCookies";
import { socialLoginOrRegisterUser } from "../services/socialLoginOrRegisterUser";

// Utils
import { sendSuccess } from "@utils/sendSuccess";
import { catchAsync } from "@utils/catchAsync";
import { throwInternalServerError } from "@utils/operationalErrors";

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
      message: "Login Successful",
      data: { user },
    });
  }
);
