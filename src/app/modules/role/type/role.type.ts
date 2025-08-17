import { HydratedDocument } from "mongoose";

export interface IRole {
  name: "customer" | "admin" | "superadmin";
  slug: "customers" | "admins" | "superadmins";
  permissions:
    | "customer_permissions"
    | "admin_permissions"
    | "superadmin_permissons";
  isDefault?: boolean; // For new users
}

export type TRoleDoc = HydratedDocument<IRole>;
