// libraries
import { startSession } from "mongoose";
import { Request } from "express";

// config
import { config } from "@config/env";

// models & types
import { UserModel } from "@app/modules/user/user.model";
import { IUser } from "@app/modules/user/user.type";
import { CustomerModel } from "@app/modules/customer/customer.model";
import { ICustomer } from "@app/modules/customer/customer.type";

// services & utils
import { sendAccountVerificationEmail } from "@app/modules/email/service";
import { generateToken, generateAvatar, throwBadRequest } from "@utils/index";

export const createCustomer = async (req: Request, user: Partial<IUser>) => {
  // Check if email user already exists
  const userExists = await UserModel.exists({ email: user.email });

  // If already signed up user, return with an error message
  if (userExists) return throwBadRequest("User already exists, login instead");

  const session = await startSession();

  try {
    session.startTransaction();

    user.image = generateAvatar(user?.name!);

    const tempAccessToken = generateToken(
      { email: user.email },
      config.accessTokenSecret as string,
      "30m"
    );

    user.emailVerificationToken = tempAccessToken;

    // Create user doc and save with session
    const newUser = new UserModel(user);
    await newUser.save({ session });

    // Create customer doc and save with session
    const customer: Partial<ICustomer> = { user: newUser._id };
    const newCustomer = new CustomerModel(customer);
    await newCustomer.save({ session });

    if (newUser._id && newCustomer._id) {
      const result = await sendAccountVerificationEmail(req, newUser);

      if (result) {
        await session.commitTransaction();
        return { email: newUser.email };
      }
    }

    // If email not sent or ids missing rollback
    await session.abortTransaction();
    return false;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
