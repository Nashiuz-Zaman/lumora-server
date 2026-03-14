import { CustomerModel } from "@app/modules/customer/customer.model";
import { throwInternalServerError } from "@utils/operationalErrors";

export const getTotalCustomers = async (): Promise<number> => {
  const totalCustomers = await CustomerModel.countDocuments();

  if (typeof totalCustomers !== "number") return throwInternalServerError();

  return totalCustomers;
};
