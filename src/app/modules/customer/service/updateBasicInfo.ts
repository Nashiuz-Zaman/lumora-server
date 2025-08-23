import { UserModel } from "@app/modules/user/user.model";

export const updateBasicInfo = async (
  userId: string,
  payload: Partial<{
    name: string;
    email: string;
    phone: string;
    displayName: string;
  }>
) => {
  const user = await UserModel.findById(userId);

  const allowedFields = ["name", "email", "phone", "displayName"] as const;

  for (const key of allowedFields) {
    if (payload[key] !== undefined) {
      (user as any)[key] = payload[key];
    }
  }

  const updated = await user?.save();

  if (updated?._id) return true;
  else return false;
};
