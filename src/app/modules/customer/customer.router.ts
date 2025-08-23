import { Router } from "express";
import multer from "multer";

import { authenticateMiddleware, approveTargetUser } from "@app/middlewares";

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
  authenticateMiddleware([UserRoles.customer]),
  getMyCustomerProfileController
);

customerRouter.get(
  "/settings-data",
  authenticateMiddleware([customer]),
  getCustomerSettingsDataController
);

customerRouter.patch(
  "/settings-data/basic-info",
  authenticateMiddleware([customer]),
  upload.none(),
  updateCustomerBasicInfoController
);

customerRouter.patch(
  "/settings-data/change-password",
  authenticateMiddleware([customer]),
  upload.none(),
  changeCustomerPasswordFromSettingsController
);

customerRouter.patch(
  "/settings-data/billing-address",
  authenticateMiddleware([customer]),
  upload.none(),
  updateBillingAddressController
);

customerRouter.patch(
  "/settings-data/shipping-address",
  authenticateMiddleware([customer]),
  upload.none(),
  updateShippingAddressController
);

customerRouter.get(
  "/",
  authenticateMiddleware([superAdmin, admin]),
  getCustomerListController
);

customerRouter.patch(
  "/block/:id",
  authenticateMiddleware([admin, superAdmin]),
  approveTargetUser([customer]),
  blockCustomerController
);

customerRouter.patch(
  "/unblock/:id",
  authenticateMiddleware([admin, superAdmin]),
  approveTargetUser([customer]),
  unblockCustomerController
);

customerRouter.delete(
  "/:id",
  authenticateMiddleware([superAdmin]),
  approveTargetUser([customer]),
  deleteCustomerController
);

export default customerRouter;
