import { toObjectId } from "@utils/objectIdUtils";
import { CartModel } from "../cart.model";

export const getUserCart = async (userId: string) => {
  const cart = await CartModel.findOne({
    user: toObjectId(userId),
  });

  if (!cart) return null;

  return await CartModel.getPopulatedCart(cart._id!);
};
