import { AppError } from "@app/classes/AppError";
import { IRole } from "@app/modules/role/type/role.type";
import { TPermittedUserRoles } from "@app/modules/user/user.constants";
import { UserModel } from "@app/modules/user/user.model";
import { ISecureRequest } from "@app/shared/types";

import { catchAsync } from "@utils/catchAsync";
import httpStatus from "http-status";

export const approveTargetUser = (
  permittedTargetUserTypes: TPermittedUserRoles = "ALL"
) => {
  return catchAsync(async (req: ISecureRequest, _res, next) => {
    const _id = req.params.id;

    const user = await UserModel.findOne({ _id }).populate("role");

    if (!user) {
      throw new AppError("User not found", httpStatus.NOT_FOUND);
    }

    const targetRoleName = (user.role as unknown as IRole)?.name;

    if (!targetRoleName) {
      throw new AppError("User role not found", httpStatus.BAD_REQUEST);
    }

    if (
      permittedTargetUserTypes !== "ALL" &&
      !permittedTargetUserTypes.includes(targetRoleName)
    ) {
      throw new AppError(
        `User must be of type: ${permittedTargetUserTypes.join(", ")}`,
        httpStatus.FORBIDDEN
      );
    }
    req.decoded!.userDoc = user;

    next();
  });
};
