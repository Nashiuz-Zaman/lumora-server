// Mongoose
import { startSession } from "mongoose";

// Models & Types
import { UserModel } from "../../user/user.model";
import { IUser } from "../../user/user.type";
import { AdminModel } from "@app/modules/admin/admin.model";
import { IAdmin } from "@app/modules/admin/admin.type";
import { RoleModel } from "@app/modules/role/model/role.model";

// Constants
import { UserRoles } from "@app/modules/user/user.constants";

// Utils
import { generateAvatar } from "@utils/generateAvatar";

export const createAdmin = async (user: Partial<IUser>) => {
  const session = await startSession();

  try {
    session.startTransaction();

    // Fill in required values
    user.image = generateAvatar(user?.name!);
    user.displayName = user.name;
    user.isVerified = true;
    user.emailVerifiedAt = new Date();
    user.role = (await RoleModel.findOne({ name: UserRoles.admin }))?._id;

    // Create user
    const newUser = new UserModel(user);
    await newUser?.save({ session });

    // Create admin and associate with the user
    const admin: Partial<IAdmin> = { user: newUser._id };

    const newAdmin = new AdminModel(admin);
    await newAdmin.save({ session });

    if (newUser._id && newAdmin._id) {
      await session.commitTransaction();
      return true;
    }

    return false;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
