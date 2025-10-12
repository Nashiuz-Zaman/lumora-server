import { Router } from "express";

// Controllers
import {
  createCouponController,
  getCouponsController,
  expireCouponsController,
  deleteCouponsController, // 🆕 import
} from "./controllers";

// Middlewares & Utilities
import { userAuthMiddleware } from "@app/middlewares";
import { UserRoles } from "../user/user.constants";

const couponRouter = Router();
const { admin, superAdmin } = UserRoles;

// POST create a new coupon
couponRouter.post(
  "/",
  userAuthMiddleware([admin, superAdmin]),
  createCouponController
);

// GET list coupons
couponRouter.get(
  "/",
  userAuthMiddleware([admin, superAdmin]),
  getCouponsController
);

// PATCH expire coupons
couponRouter.patch(
  "/expire",
  userAuthMiddleware([admin, superAdmin]),
  expireCouponsController
);

// DELETE coupons 
couponRouter.patch(
  "/delete",
  userAuthMiddleware([admin, superAdmin]),
  deleteCouponsController
);

export default couponRouter;
