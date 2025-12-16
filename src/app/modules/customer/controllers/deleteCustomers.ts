// libraries
import { RequestHandler } from "express";

// types
import { ISecureRequest } from "@app/shared/types";

// services
import { softDeleteUsers } from "@app/modules/user/services";

// utils
import { catchAsync, sendSuccess } from "@utils/index";

export const deleteCustomersController: RequestHandler = catchAsync(
  async (req: ISecureRequest, res) => {
    const { _ids } = req.body as { _ids?: string[] };

    const result = await softDeleteUsers(_ids!);

    return sendSuccess(res, { message: result });
  }
);
