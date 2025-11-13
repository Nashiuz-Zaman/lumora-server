import { UserModel } from "@app/modules/user/user.model";
import { ICustomerProfile } from "../customer.type";
import {
  throwInternalServerError,
  throwNotFound,
} from "@utils/operationalErrors";

export const updateBasicInfo = async (
  userId: string,
  data: Partial<ICustomerProfile>
) => {
  const user = await UserModel.findById(userId);
  if (!user) return throwNotFound("User not found");

  const allowedFields = ["name", "email", "phone", "image"] as const;

  for (const key of allowedFields) {
    if (data[key] !== undefined) {
      (user as any)[key] = data[key];
    }
  }

  const updated = await user?.save();

  if (updated?._id) return true;
  else return throwInternalServerError("Failed to update user basic info");
};
