import httpStatus from "http-status";
import { AppError } from "../../../classes/AppError";
import { UserStatus } from "../user.constants";
import { TUserDoc } from "../user.type";

export const unblockUser = async (user: TUserDoc) => {
  if (user!.status === UserStatus.active) {
    throw new AppError("User is already unblocked", httpStatus.BAD_REQUEST);
  }

  user!.status = UserStatus.active;
  const updated = await user!.save();

  return Boolean(updated._id);
};
