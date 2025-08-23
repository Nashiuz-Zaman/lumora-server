// libraries
import { startSession } from "mongoose";

// models & types
import { UserModel } from "@app/modules/user/user.model";
import {
  IUser,
  TUserDoc,
  TUserPopulatedDoc,
} from "@app/modules/user/user.type";
import { CustomerModel } from "@app/modules/customer/customer.model";
import { ICustomer } from "@app/modules/customer/customer.type";

// services
import { getAdmins } from "@app/modules/admin/services/getAdmins";

// utils
import {
  throwBadRequest,
  throwUnauthorized,
  generateAvatar,
} from "@utils/index";
import { getUserWithProfile } from "@app/modules/user/services";

export const socialLoginOrRegisterUser = async ({
  name,
  email,
  image,
}: {
  name: string;
  email: string;
  image?: string;
}) => {
  if (!email) return throwBadRequest("Email is required");

  const admins = await getAdmins();
  const adminEmails = admins?.map((admin: IUser) => admin?.email);

  if (adminEmails?.includes(email)) {
    return throwUnauthorized("Admins must login using email and password");
  }

  const existingUser: TUserDoc | null = await UserModel.findOne({
    email,
  });

  if (existingUser) {
    return existingUser;
  }

  const session = await startSession();

  try {
    session.startTransaction();

    const user: Partial<IUser> = {
      name,
      email,
      image: image || generateAvatar(name),
      isVerified: true,
    };

    const newUser = new UserModel(user);
    await newUser.save({ session });

    const customer: Partial<ICustomer> = {
      user: newUser._id,
    };

    const newCustomer = new CustomerModel(customer);
    await newCustomer.save({ session });

    if (newUser._id && newCustomer._id) {
      const user: Partial<TUserPopulatedDoc> | null = await getUserWithProfile({
        email,
      });

      if (user) {
        user.lastLoginAt = new Date();
        user?.save && (await user.save());

        const plainUser: Partial<IUser> = (user as TUserDoc).toObject();
        // strip sensitive fields
        delete plainUser.password;
        delete plainUser.isVerified;
        delete plainUser.status;
        delete plainUser.lastLoginAt;
        delete plainUser.updatedAt;

        await session.commitTransaction();
        return user;
      }
    }

    return false;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
