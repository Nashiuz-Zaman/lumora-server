import { CartModel } from "../cart.model";
import { throwBadRequest, throwNotFound, toObjectId } from "@utils/index";
import { TDatabaseCartDoc } from "../cart.type";

export const removeCouponFromCart = async ({
  userId,
  cartId,
}: {
  userId?: string;
  cartId?: string;
}) => {
  if (!userId && !cartId)
    return throwBadRequest("Either userId or cartId must be provided");

  let cart: TDatabaseCartDoc | null;

  if (userId) {
    // Find the cart associated with the user
    cart = await CartModel.findOne({ user: toObjectId(userId) });
  } else {
    // Find the guest cart by its _id
    cart = await CartModel.findById(toObjectId(cartId!));
  }

  if (!cart) return throwNotFound("Cart not found");

  // Remove coupon
  cart.couponCode = "";

  // Save cart and pre-save hook will handle recalculation
  await cart.save();

  return cart;
};
