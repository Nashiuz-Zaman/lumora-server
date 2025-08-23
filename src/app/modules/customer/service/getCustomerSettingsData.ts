import { getUserWithProfile } from "@app/modules/user/services";
import { throwNotFound, throwUnauthorized } from "@utils/operationalErrors";
import { toObjectId } from "@utils/toObjectId";

export const getCustomerSettingsData = async (id: string) => {
  if (!id) return throwUnauthorized("id not found");

  const user = await getUserWithProfile({ _id: toObjectId(id) });
  
  if (!user || !user.customerProfile)
    return throwNotFound("Customer not found");

  return {
    name: user.name,
    email: user.email,
    phone: user.phone,
    image: user.image,
    ...user.customerProfile,
  };
};
