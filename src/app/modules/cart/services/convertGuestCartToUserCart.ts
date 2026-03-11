import { Types } from "mongoose";
import { TDatabaseCartDoc } from "../cart.type";
import { CartModel } from "../cart.model";

export const convertGuestCartToUserCart = async (
  guestCart: TDatabaseCartDoc,
  userId: Types.ObjectId,
) => {
  guestCart.user = userId;
  await guestCart.save();

  const populated = await CartModel.getPopulatedCart(guestCart._id);

  return {
    cart: populated!,
    removeCartCookie: true,
  };
};
