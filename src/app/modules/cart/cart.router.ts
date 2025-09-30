import { Router } from "express";

import { userAuthMiddleware, cartAuthMiddleware } from "@app/middlewares";
import {
  createUserCartController,
  createGuestCartController,
  getUserCartOptionalMergeController,
  getGuestCartController,
  updateUserCartItemsController,
  updateGuestCartItemsController,
  clearUserCartController,
  clearGuestCartController,
  addCouponToUserCartController,
  addCouponToGuestCartController,
  removeCouponFromUserCartController,
  removeCouponFromGuestCartController,
} from "./controllers";

const cartRouter = Router();

// --- CREATE CARTS ---
cartRouter.post("/user-cart", userAuthMiddleware(), createUserCartController);
cartRouter.post("/guest-cart", createGuestCartController);

// --- GET CART DATA ---
cartRouter.post(
  "/user-cart/fetch-or-merge",
  userAuthMiddleware(),
  cartAuthMiddleware(),
  getUserCartOptionalMergeController
);
cartRouter.get("/guest-cart", cartAuthMiddleware(), getGuestCartController);

// --- UPDATE CARTS ---
cartRouter.patch(
  "/user-cart",
  userAuthMiddleware(),
  updateUserCartItemsController
);
cartRouter.patch(
  "/guest-cart",
  cartAuthMiddleware(),
  updateGuestCartItemsController
);

// --- APPLY COUPON ---
cartRouter.patch(
  "/user-cart/add-coupon",
  userAuthMiddleware(),
  addCouponToUserCartController
);
cartRouter.patch(
  "/guest-cart/add-coupon",
  cartAuthMiddleware(),
  addCouponToGuestCartController
);

// --- REMOVE COUPON ---
cartRouter.patch(
  "/user-cart/remove-coupon",
  userAuthMiddleware(),
  removeCouponFromUserCartController
);
cartRouter.patch(
  "/guest-cart/remove-coupon",
  cartAuthMiddleware(),
  removeCouponFromGuestCartController
);

// --- DELETE CARTS ---
cartRouter.delete("/user-cart", userAuthMiddleware(), clearUserCartController);
cartRouter.delete(
  "/guest-cart",
  cartAuthMiddleware(),
  clearGuestCartController
);

export default cartRouter;
