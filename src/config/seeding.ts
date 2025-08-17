// seed.ts

import { RoleModel } from "@app/modules/role/model/role.model";
import { UserModel } from "@app/modules/user/user.model";
import { AdminModel } from "@app/modules/admin/admin.model";
import { TRoleDoc } from "@app/modules/role/type/role.type";
import { UserRoles } from "@app/modules/user/user.constants";
import { config } from "@config/env";
import generateAvatar from "@utils/generateAvatar";

export const seedInitialData = async () => {
  try {
    // 1️⃣ Check if roles already exist
    const existingRoles = await RoleModel.find({}).lean();
    if (existingRoles.length === 0) {
      const rolesData: Omit<TRoleDoc, "_id">[] = [
        {
          name: UserRoles.customer,
          slug: UserRoles.customer + "s",
          permissions: "user_permissions",
          isDefault: true,
        } as any,
        {
          name: UserRoles.admin,
          slug: UserRoles.admin + "s",
          permissions: "admin_permissions",
        } as any,
        {
          name: UserRoles.superAdmin,
          slug: UserRoles.superAdmin + "s",
          permissions: "superadmin_permissions",
        } as any,
      ];

      await RoleModel.insertMany(rolesData);
      console.log("✅ Roles seeded");
    }

    // 2️⃣ Find the superadmin role
    const superadminRole = await RoleModel.findOne({
      name: UserRoles.superAdmin,
    });

    if (!superadminRole) throw new Error("Superadmin role not found");

    const superAdminEmail = config.superadminEmail;

    // 3️⃣ Check if superadmin user exists
    const existingSuperadmin = await UserModel.findOne({
      email: superAdminEmail,
    });

    if (!existingSuperadmin) {
      const password = config.superadminPassword;

      const name = "Super Admin";
      // Create user
      const superadminUser = await UserModel.create({
        name,
        image: generateAvatar(name!),
        email: superAdminEmail,
        password: config.superadminPassword,
        role: superadminRole._id,
        isVerified: true,
        displayName: name,
        emailVerifiedAt: new Date(),
      });

      // Optionally create admin profile
      await AdminModel.create({ user: superadminUser._id });

      console.log("✅ Superadmin user created");
    } else {
      console.log("ℹ️ Superadmin already exists");
    }
  } catch (err) {
    console.error("❌ Seeding error:", err);
  }
};
