import {
  sendSuccess,
  catchAsync,
  throwInternalServerError,
} from "@utils/index";
import { archiveOrders } from "../services";

export const archiveOrdersController = catchAsync(async (req, res) => {
  const { _ids } = req.body;
  const message = await archiveOrders(_ids);

  if (message)
    return sendSuccess(res, {
      message,
    });

  return throwInternalServerError();
});
