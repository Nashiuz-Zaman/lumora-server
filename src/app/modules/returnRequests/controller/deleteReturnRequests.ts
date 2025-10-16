import { RequestHandler } from "express";
import { catchAsync, sendSuccess } from "@utils/index";
import { deleteReturnRequests } from "../services";

export const deleteReturnRequestsController: RequestHandler = catchAsync(
  async (req, res) => {
    const { ids: _ids = [] } = req.body;
    const message = await deleteReturnRequests(_ids);
    return sendSuccess(res, { message });
  }
);
