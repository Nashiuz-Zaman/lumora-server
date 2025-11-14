import { Router } from "express";
import multer from "multer";

import { userAuthMiddleware, approveTargetUser } from "@app/middlewares";

import {
  signupCustomerController,
  getCustomerSettingsDataController,
  updateCustomerBasicInfoController,
  changeCustomerPasswordFromSettingsController,
  updateBillingAddressController,
  updateShippingAddressController,
  getCustomerListController,
  blockCustomerController,
  unblockCustomerController,
  deleteCustomerController,
  getMyCustomerProfileController,
} from "./controllers";

import { UserRoles } from "../user/user.constants";

// Router for customer-related endpoints
const { customer, admin, superAdmin } = UserRoles;
const customerRouter = Router();
const upload = multer();

customerRouter.post("/", upload.none(), signupCustomerController);

customerRouter.get(
  "/profile",
  userAuthMiddleware([UserRoles.customer]),
  getMyCustomerProfileController
);

customerRouter.get(
  "/settings-data",
  userAuthMiddleware([customer]),
  getCustomerSettingsDataController
);

customerRouter.patch(
  "/basic-info",
  userAuthMiddleware([customer]),
  updateCustomerBasicInfoController
);

customerRouter.patch(
  "/settings/change-password",
  userAuthMiddleware([customer]),
  changeCustomerPasswordFromSettingsController
);

customerRouter.patch(
  "/billing-address",
  userAuthMiddleware([customer]),
  updateBillingAddressController
);

customerRouter.patch(
  "/shipping-address",
  userAuthMiddleware([customer]),
  updateShippingAddressController
);

customerRouter.get(
  "/",
  userAuthMiddleware([superAdmin, admin]),
  getCustomerListController
);

customerRouter.patch(
  "/block/:id",
  userAuthMiddleware([admin, superAdmin]),
  approveTargetUser([customer]),
  blockCustomerController
);

customerRouter.patch(
  "/unblock/:id",
  userAuthMiddleware([admin, superAdmin]),
  approveTargetUser([customer]),
  unblockCustomerController
);

customerRouter.delete(
  "/:id",
  userAuthMiddleware([superAdmin]),
  approveTargetUser([customer]),
  deleteCustomerController
);

export default customerRouter;
