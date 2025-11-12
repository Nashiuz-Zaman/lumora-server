import { UserModel } from "../user.model";

import { IUser, TUserPopulatedDoc } from "../user.type";
import { IRole } from "../../role/type/role.type";
import { ICustomer } from "@app/modules/customer/customer.type";
import { IAdmin } from "@app/modules/admin/admin.type";

export const getUserWithProfile = async (
  filter: Partial<IUser>,
  includeProfile = true,
  extraUserFields = ""
): Promise<TUserPopulatedDoc | null> => {
  // fields to project
  const userFields = extraUserFields
    ? `name _id id email phone image status role lastLoginAt ${extraUserFields}`
    : "name _id id email phone image status role lastLoginAt";

  let query = UserModel.findOne(filter)
    .populate<{ role: IRole }>({
      path: "role",
      select: "name _id",
    })
    .select(userFields);

  // populate customer/admin profile virtuals
  if (includeProfile) {
    query = query
      .populate<{ customerProfile: ICustomer }>("customerProfile")
      .populate<{ adminProfile: IAdmin }>("adminProfile");
  }

  const user = (await query) as TUserPopulatedDoc;

  if (!user) return null;

  return user;
};
