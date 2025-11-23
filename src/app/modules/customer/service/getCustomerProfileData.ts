import { getUserWithProfile } from "@app/modules/user/services";
import { throwNotFound } from "@utils/operationalErrors";
import { toObjectId } from "@utils/objectIdUtils";
import { ICustomerProfile } from "../customer.type";

export const getCustomerProfileData = async (
  id: string
): Promise<ICustomerProfile> => {
  const user = await getUserWithProfile(
    { _id: toObjectId(id) },
    true,
    "createdAt"
  );

  if (!user || !user.customerProfile)
    return throwNotFound("Customer profile not found");

  const customer = user.customerProfile;

  return {
    name: user.name,
    email: user.email,
    phone: user.phone || "",
    image: user.image,
    createdAt: user.createdAt,
    lastLoginAt: user.lastLoginAt,
    billingAddress: customer.billingAddress,
    shippingAddress: customer.shippingAddress,
  };
};
