import { IRole } from "../role/type/role.type";

export const UserRoles = Object.freeze({
  customer: "customer",
  admin: "admin",
  superAdmin: "superadmin",
} as const);

export type TUserRole = (typeof UserRoles)[keyof typeof UserRoles];

export const UserStatus = Object.freeze({
  active: "active",
  blocked: "blocked",
  deleted: "deleted", // optional, if you're using a "deleted" status
} as const);

export type TUserStatus = (typeof UserStatus)[keyof typeof UserStatus];

export const UserSearchableFields = Object.freeze([
  "name",
  "email",
  "phone",
  "id",
]);

export type TPermittedUserRoles = IRole["name"][] | "ALL";
