import { startSession } from "mongoose";
import { UserModel } from "@app/modules/user/user.model";
import { CustomerModel } from "@app/modules/customer/customer.model";
import { getAdmins } from "@app/modules/admin/services/getAdmins";
import { throwBadRequest, throwUnauthorized } from "@utils/operationalErrors";
import generateAvatar from "@utils/generateAvatar";
import { IUser, TUserDoc } from "@app/modules/user/user.type";
import { ICustomer } from "@app/modules/customer/customer.type";
import { setAuthCookies } from "@app/modules/auth/setAuthCookies";

/**
 * Handles social login or user creation for customers.
 *
 * @param payload - Contains name, email, and image (from social provider)
 * @returns The existing or newly created user (plain object)
 * @throws If email is missing or belongs to an admin
 */
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

  const existingUser: Partial<TUserDoc> | null = await UserModel.getUser(
    { email },
    {
      select: "role image id name email phone",
    }
  );

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
      const user: Partial<TUserDoc> | null = await UserModel.getUser(
        { email },
        {
          select: "role image id name email phone",
        }
      );

      if (user) {
        user.lastLoginAt = new Date();
        user?.save && (await user.save());

        const plainUser: Partial<IUser> = (user as TUserDoc).toObject();
        //  strip password
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
