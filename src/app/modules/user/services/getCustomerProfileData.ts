import { AppError } from "@app/classes/AppError";
import { UserModel } from "../user.model";

export const getCustomerProfileData = async (userId: string) => {
  const user = await UserModel.findOne({ id: userId })
    .select("name email phone image")
    .populate("customerProfile");

  if (!user || !user.customerProfile) {
    throw new AppError("Customer profile not found", 404);
  }

  const customer = user.customerProfile;

  return {
    name: user.name,
    email: user.email,
    phone: user.phone,
    image: user.image,
    billingAddress: customer.billingAddress,
    shippingAddress: customer.shippingAddress,
  };
};
