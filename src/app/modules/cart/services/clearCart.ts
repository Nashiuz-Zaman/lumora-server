import { CartModel } from "../cart.model";
import { throwInternalServerError } from "@utils/operationalErrors";

export const clearCart = async (cartId: string) => {
  const result = await CartModel.deleteOne({ _id: cartId });

  if (!result) return throwInternalServerError();

  return true;
};
