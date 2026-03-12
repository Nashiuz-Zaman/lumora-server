import { CartModel } from "../cart.model";
import { TDatabaseCartDoc } from "../cart.type";

export const cleanupEmptyCart = async (
  cart: TDatabaseCartDoc,
): Promise<boolean> => {
  if (cart.items.length === 0) {
    await CartModel.findByIdAndDelete(cart._id);
    return true;
  }

  return false;
};
