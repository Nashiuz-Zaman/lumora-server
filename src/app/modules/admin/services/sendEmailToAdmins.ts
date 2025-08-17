import { TUserDoc } from "./../../user/user.type";

type TAdminEmailCallback = (email: string) => Promise<any>;

export const sendEmailToAdmins = async (
  admins: TUserDoc[],
  emailCallback: TAdminEmailCallback
): Promise<boolean> => {
  if (!admins.length) return false;

  // Send emails in parallel using provided callback
  await Promise.all(admins.map((admin) => emailCallback(admin.email)));

  return true;
};
