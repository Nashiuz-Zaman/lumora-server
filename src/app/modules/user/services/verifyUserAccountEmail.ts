// libraries
import { Request, Response } from "express";

// config
import { config } from "@config/env";

// app
import { clientUrl } from "@app/app";

// models & types
import { IUser } from "@app/modules/user/user.type";
import { IRole } from "@app/modules/role/type/role.type";
import { UserStatus } from "../user.constants";

// services
import { sendAccountVerificationEmail } from "@app/modules/email/service";
import { setAuthCookies } from "@app/modules/auth/services";

// utils
import {
  generateToken,
  throwInternalServerError,
  verifyToken,
} from "@utils/index";
import { getUserWithProfile } from "./getUserWithProfile";

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
  const user = await getUserWithProfile({ email });

  // No user or user blocked or deleted ❌
  if (!user || user.status !== UserStatus.active) {
    return res.redirect(clientUrl);
  }

  // Correct user but wrong token ❌
  if (user.emailVerificationToken !== token) {
    return res.redirect(clientUrl);
  }

  // Correct user and token
  const result = await verifyToken(token as string, config.accessTokenSecret!);

  // Token valid
  if (result.valid) {
    const { email: decodedEmail } = result.decoded;

    // Token valid + wrong email ❌
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

      setAuthCookies(res, {
        email: user.email,
        role,
        userId: user._id.toString(),
      });

      res.redirect(`${clientUrl}/customer`);
      return;
    }
  }

  // Correct user but invalid/expired/hacked token
  const tempAccessToken = generateToken(
    {
      email: user.email!,
    },
    config.accessTokenSecret,
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

    throwInternalServerError();
  }
};
