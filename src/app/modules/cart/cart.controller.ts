import { RequestHandler } from "express";
import { catchAsync } from "@utils/catchAsync";
import { cleanCookie } from "@utils/cleanCookie";
import { sendSuccess } from "@utils/sendSuccess";
import { ISecureRequest } from "@app/shared/types";
import { getCart } from "./services/getCart";
import { addItemToCart } from "./services/addItemToCart";
import { setCartCookie } from "./cart.util";
import { removeItemFromCart } from "./services/removeItemFromCart";
import { cleanupEmptyCart } from "./services/cleanupEmptyCart";
import { cartCookieName, emptyCart } from "./cart.constant";
import { updateCartItemQty } from "./services/updateCartItemQty";
import { clearCart } from "./services/clearCart";
import { addCouponToCart } from "./services/addCouponToCart";
import { removeCouponFromCart } from "./services/removeCouponFromCart";

export const getCartController: RequestHandler = catchAsync(
  async (req: ISecureRequest, res) => {
    const { userId, cartId } = req.decoded || {};

    const cart = await getCart(userId, cartId);

    if (cart?._id) {
      setCartCookie(res, cart?._id!.toString());
    }

    sendSuccess(res, { data: { cart } });
  },
);

export const addItemToCartController: RequestHandler = catchAsync(
  async (req: ISecureRequest, res) => {
    const { productId, variantId, quantity } = req.body;
    const { cartId, userId } = req.decoded || {};

    // Call service to handle all cart logic
    const cart = await addItemToCart(
      productId,
      variantId,
      quantity,
      cartId,
      userId,
    );

    // Set cart cookie if it’s a guest or a newly created cart
    setCartCookie(res, cart._id!.toString());

    sendSuccess(res, {
      message: "Item added to cart successfully",
      data: { cart },
    });
  },
);

export const removeItemFromCartController: RequestHandler = catchAsync(
  async (req: ISecureRequest, res) => {
    const { userId, cartId } = req.decoded || {};

    // Remove item
    const cart = await removeItemFromCart(
      req?.params?.cartItemId,
      cartId,
      userId,
    );

    // Cleanup empty cart
    const cartDeleted = await cleanupEmptyCart(cart);

    if (cartDeleted) {
      cleanCookie(res, cartCookieName);
    } else {
      setCartCookie(res, cart._id!.toString());
    }

    sendSuccess(res, {
      message: cartDeleted ? "Cart removed" : "Item removed",
      data: { cart: cartDeleted ? emptyCart : cart },
    });
  },
);

export const updateCartItemQtyController: RequestHandler = catchAsync(
  async (req: ISecureRequest, res) => {
    const { userId, cartId } = req.decoded || {};
    const { quantity } = req.body;

    // Update item quantity
    const cart = await updateCartItemQty(
      quantity,
      req?.params?.cartItemId,
      cartId,
      userId,
    );

    const cartDeleted = await cleanupEmptyCart(cart);

    if (cartDeleted) {
      cleanCookie(res, cartCookieName);
    } else {
      setCartCookie(res, cart._id!.toString());
    }

    sendSuccess(res, {
      message: cartDeleted ? "Cart removed" : "Cart item updated",
      data: { cart: cartDeleted ? emptyCart : cart },
    });
  },
);

export const clearCartController: RequestHandler = catchAsync(
  async (req: ISecureRequest, res) => {
    const { userId, cartId } = req.decoded || {};
    const isCleared = await clearCart(cartId, userId);

    if (isCleared) cleanCookie(res, cartCookieName);

    sendSuccess(res, {
      message: isCleared ? "Cart cleared successfully" : "Cart not cleared",
      data: { cart: emptyCart },
    });
  },
);

export const addCouponToCartController: RequestHandler = catchAsync(
  async (req: ISecureRequest, res) => {
    const { couponCode } = req.body;
    const { userId, cartId } = req.decoded || {};

    // Call service to add coupon
    const cart = await addCouponToCart(couponCode, cartId, userId);
    setCartCookie(res, cart!._id!.toString());

    sendSuccess(res, {
      message: "Coupon applied successfully",
      data: { cart },
    });
  },
);

export const removeCouponFromCartController: RequestHandler = catchAsync(
  async (req: ISecureRequest, res) => {
    const { userId, cartId } = req.decoded || {};

    const cart = await removeCouponFromCart(cartId, userId);
    setCartCookie(res, cart._id!.toString());

    sendSuccess(res, {
      message: "Coupon removed successfully",
      data: { cart },
    });
  },
);
