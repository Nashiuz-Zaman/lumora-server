import { RequestHandler } from "express";
import { catchAsync, sendSuccess } from "@utils/index";
import { UserRoles } from "@app/modules/user/user.constants";
import { getPaginatedUsersByRole } from "@app/modules/user/services";

export const getCustomerListController: RequestHandler = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await getPaginatedUsersByRole(UserRoles.customer, query);

  return sendSuccess(res, {
    message: `Customers fetched successfully`,
    data: result,
  });
});
