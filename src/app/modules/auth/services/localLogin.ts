import { IRole } from "../../role/type/role.type";
import { UserModel } from "../../user/user.model";
import { Response } from "express";
import { setAuthCookies } from "../auth.util";

export const localLogin = async ({
  res,
  email,
  password,
}: {
  res: Response;
  email: string;
  password: string;
}) => {
  const user = await UserModel.auth(email, password);

  if (user.role) {
    // extract role
    const role = (user.role as unknown as IRole).name;

    setAuthCookies(res, {
      email: user.email,
      role,
      userId: user._id.toString(),
    });

    return user;
  }
};
