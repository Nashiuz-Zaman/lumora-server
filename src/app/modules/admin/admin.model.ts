import { Schema, model } from "mongoose";
import { IAdmin } from "./admin.type";

const adminSchema = new Schema<IAdmin>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

// Export model
export const AdminModel = model<IAdmin>("Admin", adminSchema);
