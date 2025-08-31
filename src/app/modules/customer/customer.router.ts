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
} from "./controllers";

import { UserRoles } from "../user/user.constants";
import { getMyCustomerProfileController } from "./controllers/getMyCustomerProfile";
const { customer, admin, superAdmin } = UserRoles;

const customerRouter = Router();
const upload = multer();

customerRouter.post("/", upload.none(), signupCustomerController);

customerRouter.get(
  "/me/customer-profile/",
  userAuthMiddleware([UserRoles.customer]),
  getMyCustomerProfileController
);

customerRouter.get(
  "/settings-data",
  userAuthMiddleware([customer]),
  getCustomerSettingsDataController
);

customerRouter.patch(
  "/settings-data/basic-info",
  userAuthMiddleware([customer]),
  upload.none(),
  updateCustomerBasicInfoController
);

customerRouter.patch(
  "/settings-data/change-password",
  userAuthMiddleware([customer]),
  upload.none(),
  changeCustomerPasswordFromSettingsController
);

customerRouter.patch(
  "/settings-data/billing-address",
  userAuthMiddleware([customer]),
  upload.none(),
  updateBillingAddressController
);

customerRouter.patch(
  "/settings-data/shipping-address",
  userAuthMiddleware([customer]),
  upload.none(),
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
