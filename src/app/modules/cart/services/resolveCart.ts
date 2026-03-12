import { toObjectId } from "@utils/objectIdUtils";
import { CartModel } from "../cart.model";
import { TDatabaseCartDoc } from "../cart.type";

export const resolveCart = async (
  cartId?: string,
  userId?: string,
): Promise<TDatabaseCartDoc | null> => {
  // If cartId is provided, use it
  if (cartId) {
    return await CartModel.findById(toObjectId(cartId));
  }

  return await CartModel.findOne({ user: toObjectId(userId!) });
};
