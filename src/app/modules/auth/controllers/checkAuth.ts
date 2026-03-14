// Core
import { RequestHandler } from "express";

// Types
import { ISecureRequest } from "@app/shared/types";

// Services
import { getUserWithProfile } from "@app/modules/user/services/getUserWithProfile";

// Utils
import { catchAsync } from "@utils/catchAsync";
import { sendSuccess } from "@utils/sendSuccess";

export const checkAuthController: RequestHandler = catchAsync(
  async (req: ISecureRequest, res) => {
    const { email } = req.decoded!;

    const user = await getUserWithProfile({ email }, false);

    if (user?._id) {
      return sendSuccess(res, { data: { user } });
    }
  }
);
