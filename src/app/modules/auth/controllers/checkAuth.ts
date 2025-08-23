// Core
import { RequestHandler } from "express";

// Types
import { ISecureRequest } from "@app/shared/types";

// Services
import { getUserWithProfile } from "@app/modules/user/services";

// Utils
import { catchAsync, sendSuccess } from "@utils/index";

export const checkAuthController: RequestHandler = catchAsync(
  async (req: ISecureRequest, res) => {
    const { email } = req.decoded!;

    const user = await getUserWithProfile({ email });

    if (user?._id) {
      return sendSuccess(res, { data: { user } });
    }
  }
);
