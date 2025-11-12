// seed.ts

import { RoleModel } from "@app/modules/role/model/role.model";
import { UserModel } from "@app/modules/user/user.model";
import { AdminModel } from "@app/modules/admin/admin.model";
import { TRoleDoc } from "@app/modules/role/type/role.type";
import { UserRoles } from "@app/modules/user/user.constants";
import { config } from "@config/env";
import { generateAvatar } from "@utils/index";

export const seedSuperAdminAndDemoAdmin = async () => {
  try {
    // Check if roles already exist
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

    // Find roles
    const superadminRole = await RoleModel.findOne({
      name: UserRoles.superAdmin,
    });
    const adminRole = await RoleModel.findOne({ name: UserRoles.admin });

    if (!superadminRole) throw new Error("Superadmin role not found");
    if (!adminRole) throw new Error("Admin role not found");

    // Seed Superadmin
    const superAdminEmail = config.superadminEmail;
    const existingSuperadmin = await UserModel.findOne({
      email: superAdminEmail,
    });
    if (!existingSuperadmin) {
      const name = "Super Admin";
      const superadminUser = await UserModel.create({
        name,
        image: generateAvatar(name!),
        email: superAdminEmail,
        password: config.superadminPassword,
        role: superadminRole._id,
        isVerified: true,
        emailVerifiedAt: new Date(),
      });
      await AdminModel.create({ user: superadminUser._id });
      console.log("✅ Superadmin user created");
    } else {
      console.log("ℹ️ Superadmin already exists");
    }

    // Seed Demo Admin
    const demoAdminEmail = config.demoadminEmail;
    const existingDemoAdmin = await UserModel.findOne({
      email: demoAdminEmail,
    });
    if (!existingDemoAdmin) {
      const name = "Demo Admin";
      const demoAdminUser = await UserModel.create({
        name,
        image: generateAvatar(name!),
        email: demoAdminEmail,
        password: config.demoadminPassword,
        role: adminRole._id,
        isVerified: true,
        emailVerifiedAt: new Date(),
      });
      await AdminModel.create({ user: demoAdminUser._id });
      console.log(
        "✅ Demo admin user created (email: demo.admin@example.com, password: demoAdmin123)"
      );
    } else {
      console.log("ℹ️ Demo admin already exists");
    }
  } catch (err) {
    console.error("❌ Seeding error:", err);
  }
};
