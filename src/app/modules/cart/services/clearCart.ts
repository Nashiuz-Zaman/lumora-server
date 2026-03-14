import { CartModel } from "../cart.model";
import { resolveCart } from "./resolveCart";

export const clearCart = async (
  cartId?: string,
  userId?: string,
): Promise<boolean> => {
  if (!cartId && !userId) return true;

  const cart = await resolveCart(cartId, userId);

  if (!cart) return true;

  const deleteResult = await CartModel.deleteOne({ _id: cart._id });

  return Boolean(deleteResult?.deletedCount === 1);
};
