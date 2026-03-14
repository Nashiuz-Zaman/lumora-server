import { sendSuccess } from "@utils/sendSuccess";
import { catchAsync } from "@utils/catchAsync";
import { throwInternalServerError } from "@utils/operationalErrors";
import { archiveOrders } from "../services/archiveOrders";

export const archiveOrdersController = catchAsync(async (req, res) => {
  const { _ids } = req.body;
  const message = await archiveOrders(_ids);

  if (message)
    return sendSuccess(res, {
      message,
    });

  return throwInternalServerError();
});
