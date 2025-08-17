import { clientUrl } from "@app/app";
import { IRole } from "@app/modules/role/type/role.type";
import { sendAccountVerificationEmail } from "@app/modules/user/services/sendVerificationEmail";
import { UserModel } from "@app/modules/user/user.model";
import { IUser } from "@app/modules/user/user.type";
import { config } from "@config/env";
import { IJwtPayload } from "@shared/type/jwtPayload";
import { serverError } from "@utils/serverError";
import { setAuthCookies } from "@utils/setAuthCookies";
import { createToken } from "@utils/token";
import { verifyToken } from "@utils/verifyToken";
import { Request, Response } from "express";
import { UserStatus } from "../user.constants";

export const verifyUserAccountEmail = async (
  req: Request,
  res: Response,
  email: string,
  token: string
) => {
  if (!email || !token) {
    return res.redirect(clientUrl);
  }

  // Find user
  const user = await UserModel.getUser(
    { email },
    {
      select:
        "isVerified status role image id name email phone emailVerificationToken",
    }
  );

  // No user or user blocked or deleted ❌
  if (!user || user.status !== UserStatus.active) {
    return res.redirect(clientUrl);
  }

  // Correct user but wrong token ❌
  if (user.emailVerificationToken !== token) {
    return res.redirect(clientUrl);
  }

  // Correct user and Token
  const result = await verifyToken(token as string, config.accessTokenSecret!);

  // Token valid
  if (result.valid) {
    const { email: decodedEmail } = result.decoded as IJwtPayload;

    // Token valid + Wrong email ❌
    if (decodedEmail !== user.email) {
      return res.redirect(clientUrl);
    }

    // Correct email
    const date = new Date();
    user.isVerified = true;
    user.emailVerificationToken = "";
    user.emailVerifiedAt = date;
    user.lastLoginAt = date;

    const updatedUser = await user.save();

    if (updatedUser._id) {
      delete (user as Partial<IUser>).isVerified;
      delete (user as Partial<IUser>).emailVerificationToken;
      delete (user as Partial<IUser>).emailVerifiedAt;
      delete (user as Partial<IUser>).password;
      delete (user as Partial<IUser>).lastLoginAt;

      const role = (user.role as unknown as IRole).name;

      setAuthCookies(res, user.email, role, user._id.toString());

      res.redirect(`${clientUrl}/customer`);
      return;
    }
  }

  // Correct user but invalid/expired/hacked
  const tempAccessToken = createToken(
    {
      email: user.email!,
    },
    config.accessTokenSecret as string,
    "10m"
  );

  user.emailVerificationToken = tempAccessToken;

  const updatedUser = await user.save();

  if (updatedUser._id) {
    const result = await sendAccountVerificationEmail(req, updatedUser);

    if (result) {
      const encodedEmail = encodeURIComponent(user.email);
      const encodedToken = encodeURIComponent(false);

      return res.redirect(
        `${clientUrl}/confirmation-mail-sent?email=${encodedEmail}&oldToken=${encodedToken}`
      );
    }

    serverError();
  }
};
