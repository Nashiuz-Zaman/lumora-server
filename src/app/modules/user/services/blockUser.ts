import httpStatus from "http-status";
import { AppError } from "../../../classes/AppError";
import { UserStatus } from "../user.constants";
import { TUserDoc } from "../user.type";

export const blockUser = async (user: TUserDoc) => {
  if (user!.status === UserStatus.blocked) {
    throw new AppError("User is already blocked", httpStatus.BAD_REQUEST);
  }

  user!.status = UserStatus.blocked;
  const updated = await user!.save();

  return Boolean(updated._id);
};
