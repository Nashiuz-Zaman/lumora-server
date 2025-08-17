import { createToken } from "@utils/token";
import { UserModel } from "../user.model";
import { config } from "@config/env";
import { sendAccountVerificationEmail } from "./sendVerificationEmail";
import { Request } from "express";
import { serverError } from "@utils/serverError";
import { UserStatus } from "../user.constants";

export const resendAccountVerificationEmail = async (
  req: Request,
  email: string
) => {
  const user = await UserModel.getUser(
    { email },
    {
      select: "isVerified email status",
    }
  );

  //   No user or already verified
  if (!user || user.isVerified || user.status !== UserStatus.active)
    return false;

  const tempAccessToken = createToken(
    {
      email,
    },
    config.accessTokenSecret as string,
    "10m"
  );

  user.emailVerificationToken = tempAccessToken;

  const updatedUser = await user.save();

  if (updatedUser._id) {
    const result = await sendAccountVerificationEmail(req, updatedUser);

    if (result) {
      return true;
    }

    serverError();
  }
};
