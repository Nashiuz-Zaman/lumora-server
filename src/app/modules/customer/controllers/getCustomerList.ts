import { RequestHandler } from "express";
import { catchAsync } from "@utils/catchAsync";
import { sendSuccess } from "@utils/sendSuccess";
import { UserRoles } from "@app/modules/user/user.constants";
import { getPaginatedUsersByRole } from "@app/modules/user/services/getPaginatedUsersByRole";

export const getCustomerListController: RequestHandler = catchAsync(
  async (req, res) => {
    const query = req.query;
    const result = await getPaginatedUsersByRole(UserRoles.customer, query);

    return sendSuccess(res, {
      message: `Customers fetched successfully`,
      data: result
    });
  }
);
