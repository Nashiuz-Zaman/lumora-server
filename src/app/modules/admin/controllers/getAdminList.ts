// Express
import { RequestHandler } from "express";

// Utils
import { catchAsync, sendSuccess } from "@utils/index";

// Services
import { getPaginatedUsersByRole } from "@app/modules/user/services/getPaginatedUsersByRole";

// Constants
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
