import { UserModel } from "../user.model";
import { IUser, TUserPopulatedDoc } from "../user.type";
import { IRole } from "../../role/type/role.type";
import { ICustomer } from "@app/modules/customer/customer.type";
import { IAdmin } from "@app/modules/admin/admin.type";
import { TStringKeyOf } from "@app/shared/types";

//  Define the fields already present in the base selection.
type TDefaultUserFields =
  | "name"
  | "_id"
  | "id"
  | "email"
  | "phone"
  | "image"
  | "status"
  | "role"
  | "lastLoginAt";

//  Any key of IUser that is NOT in the DefaultUserFields list
type TAllowedExtraFields = Exclude<TStringKeyOf<IUser>, TDefaultUserFields>;

export const getUserWithProfile = async (
  filter: Partial<IUser>,
  includeProfile = true,
  // Restrict the array to only allowed keys
  extraUserFields: TAllowedExtraFields[] = [],
): Promise<TUserPopulatedDoc | null> => {
  // Base fields
  const baseFields = "name _id id email phone image status role lastLoginAt";

  // Construct projection string
  const userFields =
    extraUserFields.length > 0
      ? `${baseFields} ${extraUserFields.join(" ")}`
      : baseFields;

  let query = UserModel.findOne(filter)
    .populate<{ role: IRole }>({
      path: "role",
      select: "name _id",
    })
    .select(userFields);

  if (includeProfile) {
    query = query
      .populate<{ customerProfile: ICustomer }>("customerProfile")
      .populate<{ adminProfile: IAdmin }>("adminProfile");
  }

  const user = (await query) as TUserPopulatedDoc;

  return user || null;
};
