export const user_permissions: string[] = ["view_orders", "edit_profile"];

export const admin_permissions: string[] = [
  ...user_permissions,
  "view_users",
  "edit_user",
  "ban_user",
  "create_product",
  "edit_product",
  "manage_quotations",
  "update_order_status",
];

export const superadmin_permissions: string[] = [
  ...admin_permissions,
  "delete_users",
];
