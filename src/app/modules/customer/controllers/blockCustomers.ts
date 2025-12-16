// libraries
import { RequestHandler } from "express";

// types
import { ISecureRequest } from "@app/shared/types";

// services
import { blockUsers } from "@app/modules/user/services";

// utils
import { catchAsync, sendSuccess } from "@utils/index";

export const blockCustomersController: RequestHandler = catchAsync(
  async (req: ISecureRequest, res) => {
    const { _ids } = req.body as { _ids?: string[] };

    const result = await blockUsers(_ids!);

    return sendSuccess(res, { message: result });
  }
);
