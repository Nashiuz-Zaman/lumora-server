// libraries
import { RequestHandler } from "express";

// types
import { ISecureRequest } from "@app/shared/types";

// services
import { unblockUsers } from "@app/modules/user/services";

// utils
import { catchAsync, sendSuccess } from "@utils/index";

export const unblockCustomersController: RequestHandler = catchAsync(
  async (req: ISecureRequest, res) => {
    const { _ids } = req.body as { _ids?: string[] };

    const result = await unblockUsers(_ids!);

    return sendSuccess(res, { message: result });
  }
);
