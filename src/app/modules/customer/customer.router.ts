import { Router } from "express";
import multer from "multer";

import { userAuthMiddleware } from "@app/middlewares";

import {
  signupCustomerController,
  getCustomerSettingsDataController,
  updateCustomerBasicInfoController,
  changeCustomerPasswordFromSettingsController,
  updateBillingAddressController,
  updateShippingAddressController,
  getCustomerListController,
  blockCustomersController,
  unblockCustomersController,
  deleteCustomersController,
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

// ----------------------------- Multiple Block -----------------------------
customerRouter.patch(
  "/block",
  userAuthMiddleware([admin, superAdmin]),
  blockCustomersController
);

// ----------------------------- Multiple Unblock -----------------------------
customerRouter.patch(
  "/unblock",
  userAuthMiddleware([admin, superAdmin]),
  unblockCustomersController
);

customerRouter.patch(
  "/delete",
  userAuthMiddleware([superAdmin]),
  deleteCustomersController
);

export default customerRouter;
