import { Router } from "express";
import {
  placeOrderController,
  getOrdersPrivateController,
  markOrderShippedController,
  markOrdersDeliveredController,
  cancelOrdersController,
  archiveOrdersController,
  trackOrderController,
} from "./controllers";
import { userAuthMiddleware } from "@app/middlewares";
import { UserRoles } from "../user/user.constants";

const orderRouter = Router();
const { admin, superAdmin } = UserRoles;

//
// ----------- CUSTOMER, GUEST ROUTES -----------
//

// Track order (public)
orderRouter.get("/track/:orderId", trackOrderController);

// Place order
orderRouter.post("/", placeOrderController);

//
// ----------- ADMIN ROUTES -----------
//

// Fetch a list of all orders based on filters
orderRouter.get(
  "/",
  userAuthMiddleware([admin, superAdmin]),
  getOrdersPrivateController
);

// Mark order as shipped
orderRouter.patch(
  "/shipping-details",
  userAuthMiddleware([admin, superAdmin]),
  markOrderShippedController
);

// Mark order as delivered
orderRouter.patch(
  "/delivered",
  userAuthMiddleware([admin, superAdmin]),
  markOrdersDeliveredController
);

// Cancel orders
orderRouter.patch(
  "/cancel",
  userAuthMiddleware([admin, superAdmin]),
  cancelOrdersController
);

// Archive orders
orderRouter.patch(
  "/archive",
  userAuthMiddleware([admin, superAdmin]),
  archiveOrdersController
);

export default orderRouter;
