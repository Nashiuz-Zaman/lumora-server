// libraries
import { Request } from "express";

// config
import { config } from "@config/env";

// models & types
import { UserStatus } from "../../user/user.constants";

// services
import { sendAccountVerificationEmail } from "./sendAccountVerificationEmail";

// utils
import { generateToken } from "@utils/generateToken";
import { throwInternalServerError } from "@utils/operationalErrors";
import { getUserWithProfile } from "@app/modules/user/services/getUserWithProfile";

export const resendAccountVerificationEmail = async (
  req: Request,
  email: string,
) => {
  const user = await getUserWithProfile({ email }, false, ["isVerified"]);

  // No user or already verified
  if (!user || user.isVerified || user.status !== UserStatus.active)
    return false;

  const tempAccessToken = generateToken(
    { email },
    config.accessTokenSecret,
    "10m",
  );

  user.emailVerificationToken = tempAccessToken;

  const updatedUser = await user.save();

  if (updatedUser._id) {
    const result = await sendAccountVerificationEmail(req, updatedUser);

    if (result) {
      return true;
    }

    return throwInternalServerError();
  }
};
