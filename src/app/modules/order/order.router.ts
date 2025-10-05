import { Router } from "express";
import {
  placeOrderController,
  getOrdersPrivateController,
  markOrderShippedController,
  markOrdersDeliveredController
} from "./controllers";
import { userAuthMiddleware } from "@app/middlewares";
import { UserRoles } from "../user/user.constants";

const orderRouter = Router();
const { admin, superAdmin } = UserRoles;

//
// ----------- CUSTOMER, GUEST ROUTES -----------
//

// Place order
orderRouter.post("/", placeOrderController);

//
// ----------- ADMIN ROUTES -----------
//

//  Fetch a list of all orders based on filters
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

export default orderRouter;
