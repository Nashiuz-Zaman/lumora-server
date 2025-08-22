import httpstatus from "http-status";
import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import { IUser, IUserModel, TUserDoc } from "./user.type";
import { AppError } from "../../classes/AppError";
import { RoleModel } from "../role/model/role.model";
import { UserStatus } from "./user.constants";
import { composeMongooseTransform } from "@utils/index";
import { getNextSequence } from "../counter/counter.util";

const transformProfile = (
  _: TUserDoc,
  ret: Partial<IUser> & Record<string, any>
) => {
  if (ret.customerProfile) {
    ret.profile = ret.customerProfile;
  } else if (ret.adminProfile) {
    ret.profile = ret.adminProfile;
  }

  delete ret.customerProfile;
  delete ret.adminProfile;
  delete ret.password;

  return ret;
};

const populatableFields: string[] = ["role", "customerProfile", "adminProfile"];

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
    toJSON: { transform: composeMongooseTransform(transformProfile) },
    toObject: { transform: composeMongooseTransform(transformProfile) },
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

// Before save
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
  const user: Partial<TUserDoc> | null = await this.getUser(
    { email },
    {
      select: "+password isVerified status role image id name email phone",
    }
  );

  if (!user || !user.password)
    throw new AppError("Invalid email", httpstatus.BAD_REQUEST);

  if (!user.isVerified)
    throw new AppError("Your account is not verified", httpstatus.UNAUTHORIZED);

  if (user.status !== UserStatus.active)
    throw new AppError(
      `Your account has been ${user.status}`,
      httpstatus.UNAUTHORIZED
    );

  // If password checking is required here:
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    throw new AppError("Incorrect password", httpstatus.UNAUTHORIZED);

  user.lastLoginAt = new Date();
  user?.save && (await user.save());

  const plainUser: Partial<IUser> = (user as TUserDoc).toObject();
  //  strip unnecessary stuff
  delete plainUser.password;
  delete plainUser.isVerified;
  delete plainUser.status;
  delete plainUser.lastLoginAt;
  delete plainUser.updatedAt;

  return plainUser;
};

export const UserModel = model<IUser, IUserModel>("User", userSchema);
