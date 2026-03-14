import { Router } from "express";
import {
  getCartController,
  addItemToCartController,
  removeItemFromCartController,
  updateCartItemQtyController,
  clearCartController,
  addCouponToCartController,
  removeCouponFromCartController,
} from "./cart.controller";

import { cartAuthMiddleware } from "@app/middlewares/cartAuthMiddleware";
import { optionalAuthMiddleware } from "@app/middlewares/optionalAuthMiddleware";

const cartRouter = Router();

cartRouter.use(optionalAuthMiddleware);
cartRouter.use(cartAuthMiddleware);

/* ---------------- CART ---------------- */

cartRouter.get("/", getCartController);

cartRouter.post("/item", addItemToCartController);

cartRouter.patch("/item/:cartItemId", updateCartItemQtyController);

cartRouter.delete("/item/:cartItemId", removeItemFromCartController);

cartRouter.delete("/clear", clearCartController);

/* ---------------- COUPON ---------------- */

cartRouter.post("/coupon", addCouponToCartController);

cartRouter.delete("/coupon", removeCouponFromCartController);

export default cartRouter
