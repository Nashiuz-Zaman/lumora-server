// controllers/userByRole.controller.ts

import { RequestHandler } from "express";
import { catchAsync, sendSuccess } from "@utils/index";
import { getPaginatedUsersByRole } from "@app/modules/user/services/getPaginatedUsersByRole";
import { UserRoles } from "@app/modules/user/user.constants";

export const getAdminLIstController: RequestHandler = catchAsync(
  async (req, res) => {
    const query = req.query;
    const result = await getPaginatedUsersByRole(UserRoles.admin, query);

    return sendSuccess(res, {
      message: `Admins fetched successfully`,
      data: result,
    });
  }
);
