import { RequestHandler } from "express";
import { catchAsync } from "@utils/catchAsync";
import { sendSuccess } from "@utils/sendSuccess";
import { deleteReturnRequests } from "../services/deleteReturnRequests";

export const deleteReturnRequestsController: RequestHandler = catchAsync(
  async (req, res) => {
    const { ids: _ids = [] } = req.body;
    const message = await deleteReturnRequests(_ids);
    return sendSuccess(res, { message });
  }
);
