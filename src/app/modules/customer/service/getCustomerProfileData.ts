import { getUserWithProfile } from "@app/modules/user/services";
import { throwNotFound } from "@utils/operationalErrors";
import { toObjectId } from "@utils/toObjectId";

export const getCustomerProfileData = async (id: string) => {
  const user = await getUserWithProfile({ _id: toObjectId(id) });

  if (!user || !user.customerProfile)
    return throwNotFound("Customer profile not found");

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
