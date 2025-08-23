import { generateEmailTemplate } from "@utils/generateEmailTemplate";
import { TUserDoc } from "@app/modules/user/user.type";
import { Request } from "express";
import { sendEmail } from "@utils/sendEmail";
import { getServerUrl } from "@utils/getServerUrl";

export const sendAccountVerificationEmail = async (
  req: Request,
  user: TUserDoc
) => {
  const verificationLink = `${getServerUrl(req)}/users/confirm-user?email=${
    user.email
  }&token=${user.emailVerificationToken}`;

  const html = await generateEmailTemplate(
    "src/emails/emailVerificationTemplate.hbs",
    {
      name: user?.name!,
      verificationLink: verificationLink,
      year: new Date().getFullYear(),
    }
  );

  const result = await sendEmail(
    user?.email as string,
    "Confirm Your Account",
    html
  );

  return result ? true : false;
};
