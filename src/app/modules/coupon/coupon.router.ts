import { Router } from "express";

// Controllers
import {
  createCouponController,
  getCouponList,
  expireCouponsController,
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
couponRouter.get("/", userAuthMiddleware([admin, superAdmin]), getCouponList);

// PATCH expire coupons
couponRouter.patch(
  "/admin-expire",
  userAuthMiddleware([admin, superAdmin]),
  expireCouponsController
);

export default couponRouter;
