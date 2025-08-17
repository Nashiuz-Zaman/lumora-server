import { model, Schema } from "mongoose";
import { IRole } from "../type/role.type";
import { UserRoles } from "@app/modules/user/user.constants";

const roleSchema = new Schema<IRole>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      enum: Object.values(UserRoles),
    },
    permissions: [
      {
        type: String,
        required: true,
        enum: [
          "user_permissions",
          "admin_permissions",
          "superadmin_permissions",
        ],
      },
    ],
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { versionKey: false },
    toObject: { versionKey: false },
    timestamps: true,
  }
);

export const RoleModel = model<IRole>("Role", roleSchema);
