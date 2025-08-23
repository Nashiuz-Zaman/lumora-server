// services/updateCustomerAddress.ts
import { CustomerModel } from "@app/modules/customer/customer.model";

type AddressType = "billingAddress" | "shippingAddress";

export const updateCustomerAddress = async (
  userId: string,
  addressType: AddressType,
  payload: Partial<{
    companyName: string;
    address: string;
    country: string;
    city: string;
    state: string;
    zipCode: string;
  }>
) => {
  const customer = await CustomerModel.findOne({ user: userId });

  if (!customer) return false;

  for (const key in payload) {
    if (payload[key as keyof typeof payload] !== undefined) {
      (customer[addressType] as any)[key] = payload[key as keyof typeof payload];
    }
  }

  const updated = await customer.save();
  return !!updated._id;
};
