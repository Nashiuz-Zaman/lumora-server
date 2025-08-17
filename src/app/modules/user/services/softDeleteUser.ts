import { TUserDoc } from "../user.type";
import { UserStatus } from "../user.constants";

export const softDeleteUser = async (user: TUserDoc) => {
  user!.status = UserStatus.deleted;
  const updated = await user!.save();
  
  return Boolean(updated._id);
};
