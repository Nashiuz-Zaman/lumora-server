import { UserStatus } from "../user.constants";
import { TUserDoc } from "../user.type";
import { throwBadRequest } from "@utils/index";

export const blockUser = async (user: TUserDoc) => {
  if (user!.status === UserStatus.blocked)
    return throwBadRequest("User is already blocked");

  user!.status = UserStatus.blocked;
  const updated = await user!.save();

  return Boolean(updated._id);
};
