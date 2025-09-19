// libraries
import { Request } from "express";

// config
import { config } from "@config/env";

// models & types
import { IUser } from "@app/modules/user/user.type";
import { IRole } from "@app/modules/role/type/role.type";
import { UserStatus } from "../user.constants";

// services
import { sendAccountVerificationEmail } from "@app/modules/email/service";

// utils
import {
  generateToken,
  throwInternalServerError,
  verifyToken,
} from "@utils/index";
import { getUserWithProfile } from "./getUserWithProfile";
import { clientUrl } from "@app/app";

export type TVerifyUserAccountResult =
  | { status: "redirect"; url: string }
  | {
      status: "success";
      user: Partial<IUser>;
      authData: { email: string; role: string; userId: string };
    }
  | { status: "verification-email-sent"; email: string };

export const verifyUserAccountEmail = async (
  req: Request,
  email: string,
  token: string
): Promise<TVerifyUserAccountResult> => {
  if (!email || !token) {
    return { status: "redirect", url: clientUrl }; // fallback URL
  }

  const user = await getUserWithProfile(
    { email },
    false,
    "emailVerificationToken"
  );

  if (!user || user.status !== UserStatus.active) {
    return { status: "redirect", url: clientUrl };
  }

  if (user.emailVerificationToken !== token) {
    return { status: "redirect", url: clientUrl };
  }

  const result = await verifyToken(token as string, config.accessTokenSecret!);

  if (result.valid) {
    const { email: decodedEmail } = result.decoded;

    if (decodedEmail !== user.email) {
      return { status: "redirect", url: clientUrl };
    }

    // Mark user as verified
    const date = new Date();
    user.isVerified = true;
    user.emailVerificationToken = "";
    user.emailVerifiedAt = date;
    user.lastLoginAt = date;

    const updatedUser = await user.save();

    if (updatedUser._id) {
      const role = (user.role as unknown as IRole).name;

      // Clean up user object for return
      const safeUser: Partial<IUser> = { ...user.toObject() };
      delete safeUser.isVerified;
      delete safeUser.emailVerificationToken;
      delete safeUser.emailVerifiedAt;
      delete safeUser.password;
      delete safeUser.lastLoginAt;

      const authData = {
        email: user.email,
        role,
        userId: user._id.toString(),
      };

      return { status: "success", user: safeUser, authData };
    }
  }

  // Correct user but invalid/expired/hacked
  const tempAccessToken = generateToken(
    { email: user.email! },
    config.accessTokenSecret,
    "10m"
  );

  user.emailVerificationToken = tempAccessToken;
  const updatedUser = await user.save();

  if (updatedUser._id) {
    const emailSent = await sendAccountVerificationEmail(req, updatedUser);

    if (emailSent) {
      return { status: "verification-email-sent", email: user.email };
    }
  }

  return throwInternalServerError();
};
