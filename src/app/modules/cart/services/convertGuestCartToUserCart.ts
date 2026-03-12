import { Types } from "mongoose";
import { TDatabaseCartDoc, TPopulatedCart } from "../cart.type";
import { CartModel } from "../cart.model";

export const convertGuestCartToUserCart = async (
  guestCart: TDatabaseCartDoc,
  userId: Types.ObjectId,
): Promise<TPopulatedCart> => {
  guestCart.user = userId;
  await guestCart.save();

  const populated = await CartModel.getPopulatedCart(guestCart._id);

  return populated!;
};
