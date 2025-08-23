import { RoleModel } from "@app/modules/role/model/role.model";
import { UserModel } from "@app/modules/user/user.model";

export const getAdmins = async () => {
  // Fetch role IDs for admin and superadmin
  const roles = await RoleModel.find({
    name: { $in: ["admin", "superadmin"] },
  }).select("_id");

  const roleIds = roles.map((role: any) => role._id);
  if (!roleIds.length) return [];

  // Fetch users with those roles and non-null emails
  const admins = await UserModel.find({
    role: { $in: roleIds },
    email: { $exists: true, $ne: null },
  });

  return admins;
};
