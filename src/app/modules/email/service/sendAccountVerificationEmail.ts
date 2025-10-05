import { TUserDoc } from "@app/modules/user/user.type";
import { Request } from "express";
import { sendEmail, getServerUrl } from "@utils/index";
import { getVerificationEmailHtml } from "../generator-helpers";

export const sendAccountVerificationEmail = async (
  req: Request,
  user: TUserDoc
) => {
  const verificationLink = `${getServerUrl(req)}/users/confirm-user?email=${
    user.email
  }&token=${user.emailVerificationToken}`;

  const html = getVerificationEmailHtml(
    verificationLink,
    new Date().getFullYear()
  );

  const result = await sendEmail(
    user?.email as string,
    "Confirm Your Account",
    html
  );

  return result ? true : false;
};
