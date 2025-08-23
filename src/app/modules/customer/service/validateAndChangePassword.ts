import { UserModel } from "@app/modules/user/user.model";
import bcrypt from "bcrypt";

import { throwBadRequest, throwUnauthorized } from "@utils/operationalErrors";

export const validateAndChangePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
) => {
  const user = await UserModel.findById(userId).select("+password");

  if (!user?.password) return throwBadRequest("Password not set");

  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) return throwUnauthorized("Current password is incorrect");

  user.password = newPassword;
  return await user.save();
};
