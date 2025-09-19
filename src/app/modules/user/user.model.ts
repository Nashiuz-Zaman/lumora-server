import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import { IUser, IUserModel } from "./user.type";
import { AppError } from "../../classes/AppError";
import { RoleModel } from "../role/model/role.model";
import { UserStatus } from "./user.constants";
import { throwBadRequest, throwUnauthorized } from "@utils/index";
import { getNextSequence } from "../counter/counter.util";
import { IRole } from "../role/type/role.type";

const userSchema = new Schema<IUser, IUserModel>(
  {
    displayName: String,
    name: { type: String },
    id: { type: String, unique: true },

    email: { type: String, required: true, unique: true },
    image: { type: String, default: "" },

    password: {
      type: String,
      select: false,
      default: null,
    },
    phone: { type: String },
    isVerified: { type: Boolean, default: false },

    emailVerificationToken: { type: String },
    emailVerifiedAt: { type: Date },

    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.active,
    },

    role: {
      type: Schema.Types.ObjectId,
      ref: "Role",
    },

    lastLoginAt: { type: Date },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
    },
    toObject: {
      virtuals: true,
      versionKey: false,
    },
  }
);

// Virtual for Customer
userSchema.virtual("customerProfile", {
  ref: "Customer",
  localField: "_id",
  foreignField: "user",
  justOne: true,
});

// Virtual for Admin
userSchema.virtual("adminProfile", {
  ref: "Admin",
  localField: "_id",
  foreignField: "user",
  justOne: true,
});

// presave hook
userSchema.pre("save", async function (next) {
  try {
    // Default role
    if (this.isNew && !this.role) {
      this.role = (await RoleModel.findOne({ isDefault: true }))?._id!;
    }

    // Hash password before save
    if (this.isModified("password") && this.password) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }

    // Auto-generate id if not present
    if (this.isNew && !this.id) {
      const seq = await getNextSequence("user");
      this.id = seq.toString().padStart(4, "0");
    }

    next();
  } catch (err) {
    next(new AppError((err as Error).message));
  }
});

// Login for email
userSchema.statics.auth = async function (email: string, password: string) {
  const user = await UserModel.findOne(
    { email },
    {
      password: 1,
      isVerified: 1,
      status: 1,
      role: 1,
      image: 1,
      id: 1,
      name: 1,
      email: 1,
      phone: 1,
    }
  ).populate<{ role: IRole }>("role");

  if (!user || !user.password)
    return throwBadRequest("Invalid email or password");

  if (!user.isVerified)
    return throwUnauthorized("Your account is not verified");

  if (user.status !== UserStatus.active)
    return throwUnauthorized(`Your account has been ${user.status}`);

  // If password checking is required here:
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return throwUnauthorized("Incorrect password");

  user.lastLoginAt = new Date();
  user?.save && (await user.save());

  const plainUser = user.toObject() as Partial<
    Omit<IUser, "role"> & { role: IRole }
  >;
  //  strip unnecessary stuff
  delete plainUser.password;
  delete plainUser.isVerified;
  delete plainUser.status;
  delete plainUser.lastLoginAt;
  delete plainUser.updatedAt;

  return plainUser;
};

export const UserModel = model<IUser, IUserModel>("User", userSchema);
