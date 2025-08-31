import { CartModel } from "../cart.model";
import { throwBadRequest, throwNotFound, toObjectId } from "@utils/index";
import { TDatabaseCartDoc } from "../cart.type";

export const addCouponToCart = async ({
  userId,
  cartId,
  code,
}: {
  userId?: string;
  cartId?: string;
  code: string;
}) => {
  if (!code) return throwBadRequest("couponCode is required");

  let cart: TDatabaseCartDoc | null;

  if (userId) {
    // Find the cart associated with the user
    cart = await CartModel.findOne({ user: toObjectId(userId) });
  } else if (cartId) {
    // Find the guest cart by its _id
    cart = await CartModel.findById(toObjectId(cartId));
  } else {
    return throwBadRequest("Either userId or cartId must be provided");
  }

  if (!cart) return throwNotFound("Cart not found");

  // Attach coupon code
  cart.couponCode = code;

  // Save cart and pre-save hook will handle recalculation
  await cart.save();

  return cart;
};
