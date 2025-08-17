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
    toJSON: { virtuals: true, versionKey: false },
    toObject: { virtuals: true, versionKey: false },
  }
);

// Export model
export const AdminModel = model<IAdmin>("Admin", adminSchema);
